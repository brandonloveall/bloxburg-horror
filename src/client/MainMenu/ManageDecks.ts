import { Players } from "@rbxts/services";
import { DeckData, GetDecks_Invoke } from "shared/remotes/GetDecks/Interface";
import { SetDecks_Pub } from "shared/remotes/SetDecks/Interface";

const MainMenu = Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("MainMenu") as ScreenGui;
const decksFrame = MainMenu.WaitForChild("decks") as Frame;
const menu = MainMenu.WaitForChild("menu") as Frame;

const gotoDecks = menu.WaitForChild("menu").WaitForChild("Decks") as TextButton;
const template = MainMenu.Parent!.WaitForChild("GuiElements").WaitForChild("DeckTemplate") as Frame;
const saveAndClose = decksFrame.WaitForChild("quit") as TextButton;

const decks: Map<string, DeckData> = new Map();

GetDecks_Invoke((_decks) => {
	decks.clear();
	for (const deck of _decks) {
		const deckTemplate = template.Clone();

		const deckTitle = deckTemplate.WaitForChild("title") as TextLabel;
		const selected = deckTitle.WaitForChild("selected") as TextLabel;
		deckTitle.Text = deck.name;
		selected.Visible = deck.isSelected;
		deckTemplate.Parent = decksFrame;

		decks.set(deck.id, deck);
	}
});

gotoDecks.MouseButton1Click.Connect(() => {
	menu.Visible = false;
	decksFrame.Visible = true;
});

saveAndClose.MouseButton1Click.Connect(() => {
	const setDecks: DeckData[] = [];
	decks.forEach((e) => setDecks.push(e));
	SetDecks_Pub(setDecks);
});
