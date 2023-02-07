# plugin_forcelogout

The plugin_forcelogout is a drop in solution if you want to logout a customer from all other active sessions after they change their password. The session that is used to change the password will remain active but on all others customer will be logged out after their first action that requires an authorized activity. This adds a layer of security to your site.

## Compatibility

This cartridge works with compatibility mode of 18.10 and newer

## Tests

plugin_forcelogout does not have yet unit or end-to-end tests

## Installation
Configure cartridge path with `plugin_forcelogout` before `app_storefront_base`. Like that `plugin_forcelogout:app_storefront_base`

By default the plugin is disabled but you can turn on the feature by going to Site preferences -> Force Logoug and turn "Enable Force Logout" on.