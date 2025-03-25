export class CreateBattleDto {
    readonly contestant1Id: string;
  
    // ID del segundo concursante (en formato UUID)
    readonly contestant2Id: string;
    
    // Indica si la batalla se simula (true) o se juega manualmente (false)
    // Esto es opcional y puede tener un valor por defecto.
    readonly simulate?: boolean;
}
