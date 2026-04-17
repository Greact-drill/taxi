import type { Prisma, PrismaClient, PassengerRecord } from '../generated/prisma/client';

export class PassengerStore {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.PassengerRecordUncheckedCreateInput): Promise<PassengerRecord> {
    return this.prisma.passengerRecord.create({ data });
  }

  async findByToken(token: string): Promise<PassengerRecord | undefined> {
    return (await this.prisma.passengerRecord.findUnique({ where: { token } })) ?? undefined;
  }

  async getById(id: number): Promise<PassengerRecord | undefined> {
    return (await this.prisma.passengerRecord.findUnique({ where: { id } })) ?? undefined;
  }

  async update(id: number, patch: { name?: string; phone?: string; token?: string }): Promise<PassengerRecord> {
    const data: Prisma.PassengerRecordUncheckedUpdateInput = {};

    if (patch.name !== undefined) data.name = patch.name;
    if (patch.phone !== undefined) data.phone = patch.phone;
    if (patch.token !== undefined) data.token = patch.token;

    return this.prisma.passengerRecord.update({
      where: { id },
      data,
    });
  }
}
