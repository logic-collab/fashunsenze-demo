import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cloudflareConfig = defineCloudflareConfig();

export default {
	...cloudflareConfig,
	cloudflare: {
		...cloudflareConfig.cloudflare,
		useWorkerdCondition: false,
	},
};
