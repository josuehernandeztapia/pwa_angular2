import { 
  ServicePackageEnum,
  ServiceTypeEnum,
  ContactChannelEnum,
  ContactPurposeEnum,
  ContactOutcomeEnum,
  DeliveryData,
  DeliveryChecklistItem,
  DocumentFile,
  LegalDocuments,
  PlatesData,
  VehicleUnit,
  PostSalesRecord,
  PostSalesService,
  ImportMilestoneStatus
} from './postventa';

describe('Postventa Models', () => {
  it('should parse DeliveryData with checklist', () => {
    const checklist: DeliveryChecklistItem[] = [
      { item: 'Verificación de VIN', status: 'approved' },
      { item: 'Fotos laterales', status: 'with_issues', notes: 'Falta foto frontal' }
    ];
    const d: DeliveryData = {
      odometroEntrega: 10,
      fechaEntrega: new Date(),
      horaEntrega: '10:30',
      domicilioEntrega: 'Calle 1 #123',
      fotosVehiculo: ['https://test/1.jpg'],
      firmaDigitalCliente: 'https://test/sign.png',
      checklistEntrega: checklist,
      incidencias: [],
      entregadoPor: 'user_1'
    };
    expect(d.checklistEntrega.length).toBe(2);
  });

  it('should build LegalDocuments and PlatesData', () => {
    const pdf: DocumentFile = {
      filename: 'factura.pdf', url: 'https://test/factura.pdf', uploadedAt: new Date(), size: 1000, type: 'pdf'
    };
    const img: DocumentFile = {
      filename: 'tc.png', url: 'https://test/tc.png', uploadedAt: new Date(), size: 500, type: 'image'
    };
    const legal: LegalDocuments = {
      factura: pdf,
      polizaSeguro: pdf,
      contratos: [pdf],
      fechaTransferencia: new Date(),
      proveedorSeguro: 'ACME',
      duracionPoliza: 12,
      titular: 'Cliente Demo'
    };
    const plates: PlatesData = {
      numeroPlacas: 'ABC-123', estado: 'JAL', fechaAlta: new Date(), tarjetaCirculacion: img, fotografiasPlacas: [], hologramas: true
    };
    expect(legal.contratos.length).toBe(1);
    expect(plates.hologramas).toBeTrue();
  });

  it('should allow extended VehicleUnit fields', () => {
    const vu: VehicleUnit = {
      id: 'u1', vin: 'VIN123', serie: 'S1', modelo: 'ModeloX', year: 2024,
      color: 'Blanco', numeroMotor: 'NM123', fuelType: 'Gasolina', assignedAt: new Date(), assignedBy: 'user_1'
    };
    expect(vu.color).toBe('Blanco');
  });

  it('should support ImportMilestoneStatus aliases', () => {
    const ms: ImportMilestoneStatus = {
      status: 'completed', completedAt: new Date(), startedAt: new Date(), estimatedDays: 5
    };
    expect(ms.status).toBe('completed');
  });

  it('should accept enum values for types', () => {
    const rec: PostSalesRecord = {
      id: 'ps1', vin: 'VIN123', clientId: 'c1', postSalesAgent: 'u1', warrantyStatus: 'active', servicePackage: ServicePackageEnum.Premium,
      nextMaintenanceDate: new Date(), nextMaintenanceKm: 15000, odometroEntrega: 12, createdAt: new Date(), warrantyStart: new Date(), warrantyEnd: new Date()
    };
    const svc: PostSalesService = {
      id: 's1', vin: 'VIN123', serviceType: ServiceTypeEnum.Mantenimiento, serviceDate: new Date(), odometroKm: 15000,
      descripcion: 'Cambio de aceite', costo: 800, tecnico: 't1', customerSatisfaction: 5
    };
    expect(rec.servicePackage).toBe('premium');
    expect(svc.serviceType).toBe('mantenimiento');
  });
});

