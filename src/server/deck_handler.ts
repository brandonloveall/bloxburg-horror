import { DeckData, GetDecks_Bind } from "shared/remotes/GetDecks/Interface";
import { DataStoreService } from "@rbxts/services";
import { HttpService } from "@rbxts/services";
import { getConstructorFromId } from "shared/card_database";
import { Card } from "shared/objects/abstracts/card";
import { Investigator } from "shared/objects/abstracts/card_inherits/player_card_inherits/investigator";
import { _01501 } from "shared/objects/tangible_cards/01501";
import { _01506 } from "shared/objects/tangible_cards/01506";
import { SetDecks_Sub } from "shared/remotes/SetDecks/Interface";

GetDecks_Bind((plr: Player) => {
	const data = DataStoreService.GetDataStore(tostring(plr.UserId), "player_data");
	if (data.GetAsync("decks")[0] === undefined) {
		const parsed = HttpService.JSONDecode(
			HttpService.GetAsync(`https://arkhamdb.com/api/public/decklist/50513`), // starter roland banks i built
		) as DeckData;
		parsed.isSelected = true;

		data.SetAsync("decks", [parsed]);
	}
	return data.GetAsync("decks") as DeckData[];
});

export function getPlrsSelectedDeck(plr: Player): [(new () => Card)[], new () => Investigator] {
	const decks = DataStoreService.GetDataStore(tostring(plr.UserId), "player_data").GetAsync("decks")[0] as DeckData[];
	for (const deck of decks) {
		if (deck.isSelected) {
			const cardCons = [];
			for (const [k, v] of pairs(deck.slots)) {
				for (let i = 0; i < v; i++) {
					cardCons.push(getConstructorFromId(k)!);
				}
			}
			return [cardCons, getConstructorFromId(deck.investigator_code) as new () => Investigator];
		}
	}
	return [[_01506], _01501]; // only exists to guarantee to the compiler something will be returned. one deck will always have the isSelected() attribute
}

SetDecks_Sub((plr, decks) => {
	const data = DataStoreService.GetDataStore(tostring(plr.UserId), "player_data");

	data.SetAsync("decks", decks);
});
