import { Router } from 'express';
import { db } from '../db';
import { workshops, registrations, users } from '../db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { authenticate } from '../middleware/security';

const router = Router();

// ==========================================
// 1. GET STATISTICS (Dashboard Boxes)
// ==========================================
router.get('/stats', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'teacher') {
      // Teacher: Count workshops I created
      const myWorkshops = await db.select().from(workshops).where(eq(workshops.creatorId, userId));
      
      res.json({ 
        count: myWorkshops.length, 
        totalStudents: 0 // Placeholder until we calculate real enrollment counts
      });

    } else {
      // Student: Count workshops I joined
      const myRegs = await db.select().from(registrations).where(eq(registrations.userId, userId));
      res.json({ 
        joined: myRegs.length 
      });
    }

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ==========================================
// 2. GET WORKSHOPS (Dashboard & Marketplace)
// ==========================================
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === 'teacher') {
        // TEACHER VIEW: Return only workshops created by ME
        const result = await db.select()
            .from(workshops)
            .where(eq(workshops.creatorId, userId))
            .orderBy(desc(workshops.createdAt));
        return res.json(result);
    } 

    // STUDENT VIEW: Return ALL PUBLIC workshops
    const allWorkshops = await db
      .select()
      .from(workshops)
      .where(eq(workshops.status, 'Public')) // Matches 'Public' from your team's DB script
      .orderBy(desc(workshops.createdAt));

    // Optional: Calculate participant counts for the UI
    const allRegistrations = await db.select().from(registrations);
    const finalResult = allWorkshops.map(w => {
      const count = allRegistrations.filter(r => r.workshopId === w.id).length;
      return { ...w, participants: count };
    });
      
    res.json(finalResult);
  } catch (error) {
    console.error("Get Workshops Error:", error);
    res.status(500).json({ error: "Failed to fetch workshops" });
  }
});

// ==========================================
// 3. CREATE WORKSHOP (Teacher Only)
// ==========================================
router.post('/', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: "Only teachers can create workshops" });
    }

    // 1. Get data (Frontend sends 'location', DB wants 'room')
    // We also look for 'time' to combine it with date if needed
    const { title, topic, description, date, time, price, duration, location, status, language } = req.body;
    
    // 2. Prepare defaults
    const finalTitle = title || "Untitled Workshop";
    const finalTopic = topic || title || "General";
    
    // Combine Date & Time if both exist
    let finalDate = date || "TBD";
    if (date && time) {
        finalDate = `${date} ${time}`;
    }

    // 3. Insert into Database
    const newWorkshop = await db.insert(workshops).values({
      title: finalTitle,
      topic: finalTopic,
      description: description || "",
      date: finalDate,
      
      // MAP FIELDS:
      room: location || "Online",       // Frontend 'location' -> DB 'room'
      language: language || "EN",       // New Language field
      
      duration: duration ? parseInt(duration) : 60,
      status: status || 'Public',       // Default to Public as per schema
      creatorId: req.user.id            // The Teacher's ID
    }).returning();

    console.log("SUCCESS! Created:", newWorkshop[0]);
    res.status(201).json(newWorkshop[0]);

  } catch (error: any) {
    console.error("Create Workshop Error:", error);
    // Send the REAL error message to the frontend for easier debugging
    res.status(500).json({ error: error.message || "Database Error" });
  }
});

// ==========================================
// 4. GET MY SCHEDULE (Workshops I joined)
// ==========================================
router.get('/my', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    // 1. Find all registrations for this user
    const myRegistrations = await db.select()
      .from(registrations)
      .where(eq(registrations.userId, userId));

    if (myRegistrations.length === 0) {
      return res.json([]); 
    }

    // 2. Get the list of Workshop IDs
    const workshopIds = myRegistrations.map(r => r.workshopId);

    // 3. Fetch the actual workshop details
    const myWorkshops = await db.select()
      .from(workshops)
      .where(inArray(workshops.id, workshopIds));

    res.json(myWorkshops);
  } catch (error) {
    console.error("My Schedule Error:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// ==========================================
// 5. UPDATE WORKSHOP
// ==========================================
router.put('/:id', authenticate, async (req: any, res: any) => {
  try {
    const workshopId = parseInt(req.params.id);
    const { topic, date, location, description, language } = req.body;
    const userId = req.user.id;

    // Check if workshop exists & belongs to user
    const existing = await db.select()
      .from(workshops)
      .where(and(eq(workshops.id, workshopId), eq(workshops.creatorId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return res.status(403).json({ error: "Not authorized or workshop not found" });
    }

    // Update it
    await db.update(workshops)
      .set({
        topic,
        title: topic, // Keeping title in sync if desired
        date,
        room: location, // Map location -> room
        description,
        language
      })
      .where(eq(workshops.id, workshopId));

    res.json({ message: "Updated successfully" });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Failed to update" });
  }
});

// ==========================================
// 6. DELETE WORKSHOP
// ==========================================
router.delete('/:id', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'teacher') {
       return res.status(403).json({ error: "Only teachers can delete workshops" });
    }

    const workshopId = parseInt(req.params.id);

    // Delete the tickets (registrations) FIRST
    await db.delete(registrations).where(eq(registrations.workshopId, workshopId));

    // THEN delete the workshop
    await db.delete(workshops).where(eq(workshops.id, workshopId));

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete workshop" });
  }
});

// ==========================================
// 7. JOIN WORKSHOP
// ==========================================
router.post('/:id/join', authenticate, async (req: any, res: any) => {
  try {
    const workshopId = parseInt(req.params.id);
    const userId = req.user.id; 

    // Check for existing registration
    const existing = await db.select()
      .from(registrations)
      .where(and(
        eq(registrations.userId, userId),
        eq(registrations.workshopId, workshopId)
      ));

    if (existing.length > 0) {
      return res.status(400).json({ error: "You already joined this workshop!" });
    }

    // Create registration
    await db.insert(registrations).values({
      userId: userId,
      workshopId: workshopId
    });

    res.json({ message: "Joined successfully!" });

  } catch (error) {
    console.error("Join Error:", error);
    res.status(500).json({ error: "Failed to join" });
  }
});

// ==========================================
// 8. LEAVE WORKSHOP
// ==========================================
router.post('/:id/leave', authenticate, async (req: any, res: any) => {
  try {
    const workshopId = parseInt(req.params.id);
    const userId = req.user.id;

    await db.delete(registrations)
      .where(and(
        eq(registrations.userId, userId),
        eq(registrations.workshopId, workshopId)
      ));

    res.json({ message: "Left successfully" });

  } catch (error) {
    console.error("Leave Error:", error);
    res.status(500).json({ error: "Failed to leave workshop" });
  }
});

// ==========================================
// 9. GET PARTICIPANTS (Teachers Only)
// ==========================================
router.get('/:id/participants', authenticate, async (req: any, res: any) => {
  try {
    // Only teachers can see the list
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const workshopId = parseInt(req.params.id);

    // 1. Get User IDs from registrations
    const workshopRegistrations = await db.select()
      .from(registrations)
      .where(eq(registrations.workshopId, workshopId));

    if (workshopRegistrations.length === 0) {
      return res.json([]);
    }

    const userIds = workshopRegistrations.map(r => r.userId);

    // 2. Fetch details from Users table
    const participants = await db.select({
        id: users.id,
        username: users.username,
        email: users.email
      })
      .from(users)
      .where(inArray(users.id, userIds));

    res.json(participants);

  } catch (error) {
    console.error("Get Participants Error:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});

export default router;