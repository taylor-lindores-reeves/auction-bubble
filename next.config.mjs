/** @type {import('next').NextConfig} */

import("./src/env.mjs");

const nextConfig = {
	redirects: () => [
		{
			source: "/:path((?!api/).*)",
			destination: "/api/health",
			permanent: true,
		},
	],
};

export default nextConfig;
