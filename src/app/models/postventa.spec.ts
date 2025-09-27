import { DocumentFile, isDocumentFile, isPostSalesRecord, isVehicleUnit, PostSalesRecord, VehicleUnit } from './postventa';

describe('Postventa type guards and parsing', () => {
  it('should validate DocumentFile', () => {
    const file: DocumentFile = {
      filename: 'factura.pdf',
      url: 'https://example.com/factura.pdf',
      uploadedAt: new Date(),
      size: 12345,
      type: 'pdf'
    };
    expect(isDocumentFile(file)).toBeTrue();
    expect(isDocumentFile({})).toBeFalse();
  });

  it('should validate VehicleUnit', () => {
    const unit: VehicleUnit = {
      id: 'u1',
      vin: 'VIN123',
      serie: 'SER123',
      modelo: 'Sedan',
      year: 2023,
      color: 'Blanco',
      numeroMotor: 'MOT123',
      fuelType: 'Gasolina',
      assignedAt: new Date(),
      assignedBy: 'user1'
    };
    expect(isVehicleUnit(unit)).toBeTrue();
    expect(isVehicleUnit({ vin: 'VIN' })).toBeFalse();
  });

  it('should validate PostSalesRecord', () => {
    const rec: PostSalesRecord = {
      id: 'r1',
      vin: 'VIN123',
      clientId: 'c1',
      postSalesAgent: 'u9',
      warrantyStatus: 'active',
      servicePackage: 'basic',
      nextMaintenanceDate: new Date(),
      nextMaintenanceKm: 15000,
      odometroEntrega: 20,
      createdAt: new Date(),
      warrantyStart: new Date(),
      warrantyEnd: new Date()
    };
    expect(isPostSalesRecord(rec)).toBeTrue();
    expect(isPostSalesRecord({ id: 'x', vin: 'y' })).toBeFalse();
  });
});

