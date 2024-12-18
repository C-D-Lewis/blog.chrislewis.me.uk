Swapping Webpack for Vite
2024-12-18 13:04
Integration,TypeScript,Terraform
---

Ah, Christmas holidays. A good time for catching up on things I meant to do
before, which includes write this blog post (and not just so that the post total
is 6 for a third year running!).

For a long time I have had many static site projects use Webpack to take
care of build and running a dev server. It's one of the many useful skills and
examples gleaned from things I experience at work. Webpack's main strength
is its flexibility, including detailed configuration for many different setups
and use-cases, and a large ecosystem of plugins for even more functionality.

Lately, we discovered that the work-based use-case didn't call for as many of
the features Webpack offers as we originally thought, and in fact in some manners
the complex configuration and resource usage put us at a disadvantage.

While my site projects aren't nearly as complex as the work ones, my own goal
in using it is to simply compile a static site, ideally as quickly as possible.
With this in mind, when some new projects started using
[Vite](https://vite.dev/), I took notice.

## Enter Vite

Vite is similar to Webpack in many regards, but has some differences. For a
start, it is more opinionated about how a static site build should run, which
means for a large majority of use-case it can work in the correct manner out
of the box without complex configuration. For my simple projects, this is just
about ideal. So, I set about updating them to move from Webpack to Vite.

But what were the exact changes required? I thought it might be useful to
chronicle them here.

## Case Study: Who's At Paddy's?

![](assets/media/2024/12/paddys.png)

As an example, one project that has been updated is
[Who's At Paddy's?](https://github.com/C-D-Lewis/whosatpaddys.pub), a novelty
site that allows you to search episodes of It's Always Sunny in Philadelphia. I
used it as a test project to discover exactly what would be entailed.

The first step is updating dependencies:

```text
npm uninstall webpack webpack-cli http-server

npm install --save vite vite-plugin-static-copy
```

Next, changing the project configuration by removing the
<code>webpack.config.js</code>

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
  },
};
```

and replacing with one for Vite called <code>vite.config.ts</code>:

```js
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Set by Vite during 'build'
const isDev = process.env.NODE_ENV !== 'production';

export default {
  // For terraform-modules/s3-cloudfront-website serving of dist/index.html
  base: isDev ? '/' : '/dist',
  plugins: [
    viteStaticCopy({
      targets: [{ src: 'assets', dest: '.' }],
    }),
  ],
  server: {
    port: 8080,
  },
};
```

Though it could be reduced, this final configuration file includes some extras:

- Allowing the base path to be set depending on whether it is running locally or being served in an S3 CloudFront setup in AWS, which most of these sites are.

- Copying assets to the build folder with the correct paths.

- Running a dev server with default options and a selected port.

Note that Vite did not need separate configuration or plugins to handle the
fact it was a TypeScript project - this is supported out of the box!

In the code itself, the application code doesn't need to change at all. However,
we have a new entrypoint for the main <code>script</code> tag:

```text
-    <... type="text/javascript" src="dist/bundle.js?v=COMMIT">
+    <... type="module" src="./src/index.ts">
```

Vite builds have different names on each build, removing the need for the
cache-busting parameter to be added to files like <code>bundle.js</code>. It
is this new reference to the index file in the application that tells Vite to
build it.

The next step is to update the Terrform for the project to specify the new
index file for CloudFront - this is because Vite builds start with and include
the <code>index.html</codd> file:

```terraform
module "main" {
  source = "github.com/c-d-lewis/terraform-modules//s3-cloudfront-website?ref=master"

  region               = "us-east-1"
  project_name         = "whosatpaddys.pub"
  zone_id              = "Z0366509V094HMD6CEGE"
  domain_name          = "whosatpaddys.pub"
  alt_domain_name      = "www.whosatpaddys.pub"
  certificate_arn      = "arn:aws:acm:us-east-1:617929423658:certificate/72e3a39b-e701-4269-b429-af2a6a312db9"
  default_root_object  = "dist/index.html"
}
```

The new variable <code>default_root_object</code> allows this to be set only
for projects that are migrated to Vite, which is more flexible.

Lastly, we just need to update the npm scripts:

```text
-    "build": "npm run clean && webpack --mode production",
-    "start": "npm run build:dev && http-server"
+    "build": "npm run clean && vite build",
+    "start": "vite"
```

## Conclusion

So, it took a little trial and error to get this process all working (what good
project doesn't?) with build and deployments, but I think it's worth it. Vite
is much quicker to start (milliseconds!) and simplifies the project structure.
In a small project like this the difference is not so large, but with the larger
projects at work the benefits are quite significant. I'm excited to see if there
are any other ways this could be streamlined even further in the future...

```text
$ npm start

> whosatpaddys.pub@1.0.0 start
> vite

Port 8080 is in use, trying another one...
[vite-plugin-static-copy] Collected 1 items.

  VITE v5.4.11  ready in 261 ms

  ➜  Local:   http://localhost:8081/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
