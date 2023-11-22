export const mockCardContent = {
	"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
	"type": "AdaptiveCard",
	"version": "1.3",
	"body": [{
		"type": "Container",
		"items": [
			{
				"type": "ColumnSet",
				"id": "${hitId}",
				"columns": [
					{
						"type": "Column",
						"width": "stretch",
						"id": "itemTitle",
						"items": [{
							"type": "TextBlock",
							"weight": "bolder",
							"id": "trackEvent",
							"spacing": "small",
							"text": "<div id='eventData' category='SearchResultsEvents' action='SearchResultItemClicked' value='1' dimensions='${jsonStringify([{key:'ViewedResults',value:'https://fakeitem'},{key:'ClickedItemRanks',value:1})])}'>title</div>",
							"size": "large"
						}]
					}
				]
			}
		]
	}]
};