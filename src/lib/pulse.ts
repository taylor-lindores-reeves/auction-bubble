import { db } from "./db";

// TODO use pulse so that it updates bids in realtime on the UI by integration with pusher

async function bidSub() {
	const subscription = await db.bid.subscribe();

	setTimeout(() => {
		console.log("Stopping the subscription.");
		subscription.stop();
	}, 60000);

	for await (const event of subscription) {
		switch (event.action) {
			case "create":
				console.log("create event:", event);
				await db.bid.update({
					where: { id: event.created.id },
					data: { amount: event.created.amount * 100 },
				});
				break;
			case "update":
				console.log("update event:", event);
				break;
			case "delete":
				console.log("delete event:", event);
				break;
		}
	}
}

async function itemSub() {
	const subscription = await db.item.subscribe();

	setTimeout(() => {
		console.log("Stopping the subscription.");
		subscription.stop();
	}, 60000);

	for await (const event of subscription) {
		switch (event.action) {
			case "create":
				console.log("create event:", event);
				await db.item.update({
					where: { id: event.created.id },
					data: {
						reservePrice: Number(event.created.reservePrice) * 100,
						bidIncrements: Number(event.created.bidIncrements) * 100,
						startingPrice: Number(event.created.startingPrice) * 100,
					},
				});
				break;
			case "update":
				console.log("update event:", event);
				await db.item.update({
					where: { id: event.after.id },
					data: {
						reservePrice: Number(event.after.reservePrice) * 100,
						bidIncrements: Number(event.after.bidIncrements) * 100,
						startingPrice: Number(event.after.startingPrice) * 100,
					},
				});
				break;
			case "delete":
				console.log("delete event:", event);
				break;
		}
	}
}

async function main() {
	await bidSub();
	await itemSub();
}

main().catch((err) => console.error(err));
