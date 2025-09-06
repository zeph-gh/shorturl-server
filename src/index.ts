import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { nanoid } from 'nanoid'
import { URL } from 'url'
import { PrismaClient } from './generated/prisma/index.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const prisma = new PrismaClient() // ORM

app.use(cors())
app.use(express.json())

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

app.post('/api/shorten', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required' })
  }

  const { url } = req.body

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    for (let attempt = 1; attempt <= 5; attempt++) {
      const code = nanoid(8)

      try {
        const createdShortUrl = await prisma.short_urls.create({
          data: {
            code,
            target_url: url,
          },
        })

        return res.status(201).json({
          shortUrl: `${req.protocol}://${req.get('host')}/${
            createdShortUrl.code
          }`,
        })
      } catch (error: any) {
        // P2002 is a unique constraint violation from Prisma
        if (error.code !== 'P2002' && attempt == 5) {
          console.error('Database error:', error)
          return res.status(500).json({ error: 'Failed to shorten URL' })
        }
      }
    }
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Failed to shorten URL' })
  }
})

app.get('/:code', async (req, res) => {
  const { code } = req.params

  try {
    const foundShortUrl = await prisma.short_urls.findUnique({
      where: { code },
    })

    if (!foundShortUrl) {
      return res.status(404).send('Short URL not found')
    }

    return res.redirect(foundShortUrl.target_url)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).send('Internal server error')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
