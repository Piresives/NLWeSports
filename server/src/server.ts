import express from 'express'
import cors from 'cors'
import {PrismaClient} from '@prisma/client'
import { convertHourStringToMinutes } from './utils/converter-horas-em minutos'
import { convertMinuteStringToMinutes } from './utils/converter-minutos em horas'

const app = express()

app.use(express.json())
app.use(cors())


const prisma = new PrismaClient({
    log: ['query']
})

//localhost:3333/ads

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games);
});

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body: any = request.body;


    const ad = await prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yarsPlaying: body.yarsPlaying,  
            discord: body.discord,
            weekDaays: body.weekDaays.join(","),
            hoursStart: convertHourStringToMinutes(body.hoursStart), 
            hoursEnd: convertHourStringToMinutes(body.hoursEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return response.status(201).json(ad);
});

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDaays: true,
            useVoiceChannel: true,
            yarsPlaying: true,
            hoursStart: true,
            hoursEnd: true,
        },

        where:{
            gameId,
        },

        orderBy: {
           createdAt: 'desc',
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ads,
            weekDays: ad.weekDaays.split(','),
            hoursStart: convertMinuteStringToMinutes(ad.hoursStart),
            hoursEnd: convertMinuteStringToMinutes(ad.hoursEnd)
        }
    }))
   
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord: true,
        },

        where: {
            id:adId
        }
    })

    return response.json({
        discord: ad.discord,
    });  
})


app.listen(3333)
