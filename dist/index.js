import express from 'express';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { URL } from 'url';
import { PrismaClient } from './generated/prisma/index.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
app.use(express.json());
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
app.post('/api/shorten', async (req, res) => {
    const { url } = req.body;
    if (!url || !isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    try {
        const code = nanoid(8); // generate 8 character code
        const newShortUrl = await prisma.short_urls.create({
            data: {
                code,
                target_url: url,
            },
        });
        return res.status(201).json({
            shortUrl: `${req.protocol}://${req.get('host')}/${newShortUrl.code}`,
        });
    }
    catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to shorten URL' });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map