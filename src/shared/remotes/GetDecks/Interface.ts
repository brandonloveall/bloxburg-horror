export interface DeckData {
	id: string;
	name: string;
	investigator_code: string;
	slots: Record<string, number>;
	isSelected: boolean;
}

const GetDecks = script.Parent!.WaitForChild("GetDecks") as RemoteFunction;

export function GetDecks_Bind(callback: (plr: Player) => DeckData[]) {
	GetDecks.OnServerInvoke = callback;
}

export function GetDecks_Invoke(callback: (decks: DeckData[]) => void) {
	callback(GetDecks.InvokeServer());
}
