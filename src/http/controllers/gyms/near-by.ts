import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearByGymsUseCase } from '@/use-cases/factories/make-fetch-near-by-gyms-use-case'

export async function nearBy(request: FastifyRequest, reply: FastifyReply) {
  const nearByGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
  })

  const { latitude, longitude } = nearByGymsQuerySchema.parse(request.query)

  const nearByGymsUseCase = makeFetchNearByGymsUseCase()

  const { gyms } = await nearByGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
