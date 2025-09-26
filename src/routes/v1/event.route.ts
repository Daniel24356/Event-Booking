import EventController from "../../controllers/event.controller";
import express from 'express';

const router = express.Router();
const controller = new EventController();

router.get(
  '/',
  controller.getEvents
);

router.post(
  '/',
  controller.createEvent
);