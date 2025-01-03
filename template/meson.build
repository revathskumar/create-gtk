# Define our project
project(
	'<project.name>',
	version: '1.0.0',
	license: ['MIT'],
	meson_version: '>= 1.0.1'
)

APP_ID = 'com.<user>.<project.name>'

# Import the modules
gnome = import('gnome')

# Load instructions from subdirectories
subdir('data')
subdir('dist')

# Post installation tasks
# gnome.post_install(
#   glib_compile_schemas: true,
# 	gtk_update_icon_cache: true,
# 	update_desktop_database: true
# )
