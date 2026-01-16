import { Router } from 'express';
import { db } from '../db';
import { workshops, registrations } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '../middleware/security';

const router = Router();

// GET all public workshops + Participant Count
router.get('/', async (req, res) => {
  try {
    const allWorkshops = await db
      .select()
      .from(workshops)
      .where(eq(workshops.status, 'public'));

    const allRegistrations = await db.select().from(registrations);

    // Count guests for each workshop
    const finalResult = allWorkshops.map(w => {
      // We use == to match string ID "5" with number ID 5
      const count = allRegistrations.filter(r => r.workshopId == w.id).length;
      return { ...w, participants: count };
    });
      
    res.json(finalResult);
  } catch (error) {
    console.error("Get Workshops Error:", error);
    res.status(500).json({ error: "Failed to fetch workshops" });
  }
});

// POST: Create a new workshop
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
       return res.status(403).json({ error: "Only teachers can create workshops" });
    }

    const { topic, date, location, description, status } = req.body;
    
    await db.insert(workshops).values({
      topic, 
      date: new Date(date),
      location,
      description,
      status: status || 'draft',
      creatorId: req.user.id // 👈 FIX 1: We now tell the DB who created it!
    });

    res.status(201).json({ message: "Workshop created" });
  } catch (error) {
    console.error("Create Workshop Error:", error);
    res.status(500).json({ error: "Failed to create workshop" });
  }
});

// DELETE: Remove a workshop
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: "Only teachers can delete workshops" });
   }

    const workshopId = parseInt(req.params.id);

    // 👈 FIX 2: Delete the tickets (registrations) FIRST
    await db.delete(registrations).where(eq(registrations.workshopId, workshopId));

    // THEN delete the workshop
    await db.delete(workshops).where(eq(workshops.id, workshopId));

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete workshop" });
  }
});

// POST: Join a workshop
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const workshopId = parseInt(req.params.id);
    const userId = req.user.id; 

    const existing = await db.select()
      .from(registrations)
      .where(and(
        eq(registrations.userId, userId),
        eq(registrations.workshopId, workshopId)
      ));

    if (existing.length > 0) {
      return res.status(400).json({ error: "You already joined this workshop!" });
    }

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

export default router;