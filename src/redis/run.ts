import axios from "axios";
import { xAckBulk, xReadGroup, ensureConsumerGroup } from "./index";
import prisma  from "../lib/prisma";

const WORKER_ID = process.env.WORKER_ID!;

if (!WORKER_ID) {
    throw new Error("Worker ID not provided");
}

async function main() {
    // No need to ensure consumer group by region, just use a generic group name
    const CONSUMER_GROUP = "default";
    await ensureConsumerGroup(CONSUMER_GROUP);
    while(1) {
        const response = await xReadGroup(CONSUMER_GROUP, WORKER_ID);

        if (!response) {
            continue;
        }

        let promises = response.map(({message}) => fetchWebsite(message.url, message.id))
        await Promise.all(promises);
        console.log(promises.length);

        xAckBulk(CONSUMER_GROUP, response.map(({id}) => id));
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>((resolve, reject) => {
        const startTime = Date.now();

        axios.get(url)
            .then(async () => { 
                const endTime = Date.now();
                await prisma.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Up",
                        website_id: websiteId
                    }
                })
                resolve()
            })
            .catch(async () => {
                const endTime = Date.now();
                await prisma.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Down",
                        website_id: websiteId
                    }
                })
                resolve()
            })
    })
}

main();