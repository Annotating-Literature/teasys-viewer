const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.svg","fonts/eb-garamond-500-italic.woff2","fonts/eb-garamond-500.woff2","fonts/eb-garamond-600.woff2","fonts/eb-garamond-700.woff2","fonts/eb-garamond-italic.woff2","fonts/eb-garamond-regular.woff2","robots.txt","uploads/pages/1773680679152-Screenshot_2026-03-16_at_13.12.54.png"]),
	mimeTypes: {".svg":"image/svg+xml",".woff2":"font/woff2",".txt":"text/plain",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.BNx8-hd-.js",app:"_app/immutable/entry/app.BjFPV18R.js",imports:["_app/immutable/entry/start.BNx8-hd-.js","_app/immutable/chunks/ClOgXLPN.js","_app/immutable/chunks/DLVpGK2M.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/entry/app.BjFPV18R.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DLVpGK2M.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/BLbPi5EO.js","_app/immutable/chunks/BcUw28Pf.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BV4aXbRb.js')),
			__memo(() => import('./chunks/1-DJ_zSFXT.js')),
			__memo(() => import('./chunks/2-rittmEkU.js')),
			__memo(() => import('./chunks/3-BOFqi1wm.js')),
			__memo(() => import('./chunks/4-Dd_Dtdtu.js')),
			__memo(() => import('./chunks/5-B5Al3ob1.js')),
			__memo(() => import('./chunks/6-BPt4Bp9b.js')),
			__memo(() => import('./chunks/7-CFa-G5yp.js')),
			__memo(() => import('./chunks/8-B_4Mm5tY.js')),
			__memo(() => import('./chunks/9-BuOkdUU8.js')),
			__memo(() => import('./chunks/10-D_90lAMk.js')),
			__memo(() => import('./chunks/11-Dh88kNN6.js')),
			__memo(() => import('./chunks/12-CmQUkbmh.js')),
			__memo(() => import('./chunks/13-1lPsuMu3.js')),
			__memo(() => import('./chunks/14-CGJDqVW5.js')),
			__memo(() => import('./chunks/15-FRYYQxWj.js')),
			__memo(() => import('./chunks/16-CkBYu9y3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin/authors/[authorSlug]",
				pattern: /^\/admin\/authors\/([^/]+?)\/?$/,
				params: [{"name":"authorSlug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/pages",
				pattern: /^\/admin\/pages\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/pages/[slug]",
				pattern: /^\/admin\/pages\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/texts",
				pattern: /^\/admin\/texts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/api/authors/[authorSlug]/portrait",
				pattern: /^\/api\/authors\/([^/]+?)\/portrait\/?$/,
				params: [{"name":"authorSlug","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CEPIy1Xk.js'))
			},
			{
				id: "/api/texts",
				pattern: /^\/api\/texts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BLAhWS8b.js'))
			},
			{
				id: "/api/texts/[textId]",
				pattern: /^\/api\/texts\/([^/]+?)\/?$/,
				params: [{"name":"textId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-p-D4g8hq.js'))
			},
			{
				id: "/api/texts/[textId]/annotations",
				pattern: /^\/api\/texts\/([^/]+?)\/annotations\/?$/,
				params: [{"name":"textId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-SHFILYb_.js'))
			},
			{
				id: "/api/texts/[textId]/annotations/[annotationId]",
				pattern: /^\/api\/texts\/([^/]+?)\/annotations\/([^/]+?)\/?$/,
				params: [{"name":"textId","optional":false,"rest":false,"chained":false},{"name":"annotationId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CgzFjo-a.js'))
			},
			{
				id: "/api/texts/[textId]/export",
				pattern: /^\/api\/texts\/([^/]+?)\/export\/?$/,
				params: [{"name":"textId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B_7uT6_E.js'))
			},
			{
				id: "/api/upload/pages",
				pattern: /^\/api\/upload\/pages\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DdmsYzBd.js'))
			},
			{
				id: "/authors",
				pattern: /^\/authors\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/authors/[authorSlug]",
				pattern: /^\/authors\/([^/]+?)\/?$/,
				params: [{"name":"authorSlug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Dthc0-Qp.js'))
			},
			{
				id: "/texts/[textId]",
				pattern: /^\/texts\/([^/]+?)\/?$/,
				params: [{"name":"textId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,,], errors: [1,3,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/texts/[textId]/annotate",
				pattern: /^\/texts\/([^/]+?)\/annotate\/?$/,
				params: [{"name":"textId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,,], errors: [1,3,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/[slug]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
