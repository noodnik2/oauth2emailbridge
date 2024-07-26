import { Router } from 'express';
import {sendEmail, oauthCallback, getAuthUrl, listEmails} from '../controllers/emailController';

const router = Router();

// Supported HTTP endpoints (relative to top-level app URI):

router.get('/auth-url', getAuthUrl);
router.get('/oauth-callback', oauthCallback);
router.post('/send', sendEmail);
router.post('/list', listEmails);

export default router;
