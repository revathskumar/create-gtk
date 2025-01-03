# Compile the resources
# gnome.compile_resources(
# 	APP_ID + '.data',
# 	APP_ID + '.data.gresource.xml',
# 	gresource_bundle: true,
# 	install: true,
# 	install_dir: get_option('datadir') / APP_ID
# )

# # Install the application icons
# install_data(
# 	'icons' / APP_ID + '.svg',
# 	install_dir: get_option('datadir') / 'icons' / 'hicolor' / 'scalable' / 'apps'
# )
# install_data(
# 	'icons' / APP_ID + '-symbolic.svg',
# 	install_dir: get_option('datadir') / 'icons' / 'hicolor' / 'symbolic' / 'apps'
# )

configure_file(
  input: APP_ID + '.metainfo.xml',
  output: APP_ID + '.metainfo.xml.in',
  configuration: {
    'APP_ID': APP_ID,
  },
)
