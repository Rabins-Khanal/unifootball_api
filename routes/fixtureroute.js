import express from 'express';
import { create, deletefixture, getfixtures, updatefixture } from '../controllers/fixture.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getfixtures', getfixtures)
router.delete('/deletefixture/:fixtureId/:userId', verifyToken, deletefixture)
router.put('/updatefixture/:fixtureId/:userId', verifyToken, updatefixture)


export default router;