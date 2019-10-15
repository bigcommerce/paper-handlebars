# Changelog

## Unreleased

## 4.2.3
- Add ability to pass logger. Will be used for library as well as handlebars. Must conform to console interface (info, error, log, etc). Defaults to console object.

## 4.2.2
- Fix addTemplates logic in order to not lose templates on renderTheme function for Stencil CLI

## 4.2.1
- Allow json helper to accept a SafeString as an argument
- Move SafeString unwrapping to common module

## 4.2.0
- Add setURLQueryParam helper
- Make getImageSrcset not generate default srcsets larger than the original image when the dimensions are known
- Make getImage not generate an image larger than the dimensions of the original image if the dimensions are known

## 4.1.2
- Allow stripQuerystring to accept a Safestring as an argument
- Refactor getImage helper to return image URL as SafeString instead of string

## 4.1.1
- Revert usage of SafeString on getImage

## 4.1.0
- Upgrade Lodash to 4.17.13
- Reduce arguments usage where possible
- Refactor helper functions to use Handlebars utils type checks instead of Lodash type checks
- Add getImageSrcset helper
- Refactor getImage helper to return image URL as SafeString instead of string

## 4.0.9
- Revert "Refactor functions away from arguments pattern for better performance" from 4.0.7
- Revert "Reduce usage of Lodash to improve performance" from 4.0.7

## 4.0.8
- Update handlebars v4 to latest
- Update handlebars v3 to latest

## 4.0.7
- Remove regex in cdnify.js to improve performance
- Remove regex in fonts.js for better performance
- Refactor functions away from arguments pattern for better performance
- Fix for helper to allow for one iteration
- Reduce usage of Lodash to improve performance

## 4.0.6
- Change default behavior of {{getFontsCollection}} to use font-display: swap for Google Fonts and allow configuration

## 4.0.5
- Fix regex performance to match precompiled templates.

## 4.0.4
- Added trimming of all '.' and '/' from begginig of cdn path (not full paths)

## 4.0.3
- Fix resourceHints to use https for font providers

## 4.0.2
- Fix region helper not rendering with an empty page content

## 4.0.1
- Fix cdnify to avoid double slash in the genrated url.

## 4.0.0
- Change render and renderString to return Promises instead of synchronous results.

## 3.0.3
- Add support for gtnum in if helper.

## 3.0.2
- Add getFontLoaderConfig and resourceHints helpers.

## 3.0.1
- Fix cdn and stylesheet helpers to pull latest siteSettings and themeSettings

## 3.0.0
- Change addContent() to setContent() for consistency with other setters.
- Add getter and setter for siteSettings and themeSettings, and change helper context
  to use a bound function for accessing these data to allow for deferred setting.
  Callers should no longer access siteSettings and themeSettings directly.

## 2.0.0
- Change error handling to throw custom errors instead of swallowing the error
  and logging. This gives the caller the opportunity to take action based on
  the error condition.
- Remove logging interface since we don't use it anymore.

## 1.0.0
- Initial extraction from stencil-paper
