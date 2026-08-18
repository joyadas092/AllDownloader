# ---- deps ----
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js resolves these at BUILD time, not at run time:
#   SITE_URL      -> metadataBase, every canonical URL, sitemap.xml, robots.txt
#   BRAND_NAME    -> titles, schema, manifest
#   NEXT_PUBLIC_* -> inlined into the client bundle
#
# Setting them only as runtime variables is not enough — the static pages would
# ship with localhost canonicals and no ad keys. On Railway, declare these as
# service variables; Railway forwards them to declared build args automatically.
ARG SITE_URL
ARG BRAND_NAME
ARG CONTACT_EMAIL
ARG NEXT_PUBLIC_ADSTERRA_TOP
ARG NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER
ARG NEXT_PUBLIC_ADSTERRA_MIDDLE
ARG NEXT_PUBLIC_ADSTERRA_BOTTOM
ARG NEXT_PUBLIC_ADSTERRA_SIDEBAR

ENV SITE_URL=$SITE_URL \
    BRAND_NAME=$BRAND_NAME \
    CONTACT_EMAIL=$CONTACT_EMAIL \
    NEXT_PUBLIC_ADSTERRA_TOP=$NEXT_PUBLIC_ADSTERRA_TOP \
    NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER=$NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER \
    NEXT_PUBLIC_ADSTERRA_MIDDLE=$NEXT_PUBLIC_ADSTERRA_MIDDLE \
    NEXT_PUBLIC_ADSTERRA_BOTTOM=$NEXT_PUBLIC_ADSTERRA_BOTTOM \
    NEXT_PUBLIC_ADSTERRA_SIDEBAR=$NEXT_PUBLIC_ADSTERRA_SIDEBAR

RUN npm run build

# ---- runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# ffmpeg (merging/audio extraction) + python3/pip (to install yt-dlp)
#
# yt-dlp is pinned deliberately. Unpinned, the version is whatever was current
# when the image last built, which then sits frozen while the platforms it
# tracks keep changing. Pinning makes the version visible and updating it a
# decision rather than a side effect of rebuilding.
#
# Bump this regularly; yt-dlp ships fixes roughly weekly and a downloader that
# does not follow it degrades quietly.
ARG YTDLP_VERSION=2026.7.4
#
# The [default] extra is load-bearing, not cosmetic: it pulls in yt-dlp-ejs,
# the solver for YouTube's "n challenge". Without it YouTube hands back only
# thumbnails -- every media format is withheld, and yt-dlp reports the confusing
# "Requested format is not available" rather than anything about a challenge.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg python3 python3-pip curl \
    && pip3 install --no-cache-dir --break-system-packages "yt-dlp[default]==${YTDLP_VERSION}" \
    && rm -rf /var/lib/apt/lists/*

# Solving that challenge also needs a JavaScript runtime. yt-dlp defaults to
# Deno, but this image already ships Node -- hence node:22-slim rather than 20,
# since yt-dlp requires Node >= 22. Reusing it avoids a second runtime in the
# image. Override to `deno` (and install it above) if Node support regresses.
ENV YTDLP_JS_RUNTIME=node

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

RUN mkdir -p /app/tmp-downloads

# `next start` honours PORT, which Railway sets for you.
EXPOSE 3000
CMD ["npm", "start"]
