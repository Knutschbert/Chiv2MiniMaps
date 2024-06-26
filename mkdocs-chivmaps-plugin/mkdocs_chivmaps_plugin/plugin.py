import os
import sys
import shutil
from timeit import default_timer as timer
from datetime import datetime, timedelta

from mkdocs import utils as mkdocs_utils
from mkdocs.config import config_options, Config
from mkdocs.plugins import BasePlugin

# add Empty pages (normal, interactive map, folder)
# add "map" div to pages

class ChivMapsPlugin(BasePlugin):

    data_dir = 'MapData'
    target_dir = 'docs/MiniMaps'
    marker_name = 'markers.js'
    server = None

    config_scheme = (
        ('param', config_options.Type(str, default='')),
    )

    def __init__(self):
        self.enabled = True
        self.total_time = 0

    def on_serve(self, server, config, builder):
        return server

    def on_config(self, config):
        self.target_dir = config["docs_dir"] + '/MiniMaps'
        return config

    def on_pre_build(self, config):
        # print('on_pre_build', config)
        # print(os.path.abspath('.'))
        mkdocs_utils.log.info("site: %s, docs: %s", config["site_dir"], config["docs_dir"])
        
        # if os.path.exists(self.target_dir):
        #     shutil.rmtree(self.target_dir)
        if not os.path.exists(self.target_dir):
            os.makedirs(self.target_dir)
        needs_index_rebuild = False
            
        for dir_name in os.listdir(self.data_dir):
            # print(dir_name)
            if not os.path.exists(os.path.join(self.target_dir, dir_name+'.md')):
                with open(os.path.join(self.target_dir, dir_name+'.md'), 'w') as f:
                    f.write(f'## {dir_name} Interactive Map')
                    f.close()
                    needs_index_rebuild = True
        
        if needs_index_rebuild:            
            with open(os.path.join(self.target_dir, 'index.md'), 'w') as f:
                f.writelines([ f' - ## [[{d}]]\n' for d in os.listdir(self.data_dir)])
                f.close()
            # if (os.path.exists(os.path(self.data_dir, dir_name, 'markers.js')))
            # if os.path.exists(os.path.join(dir_name, 'tiles')):
                
        return

    def on_post_build(self, config):
        # shutil.rmtree(self.target_dir)
        for dir_name in os.listdir(self.data_dir):
            src_path = os.path.join(self.data_dir, dir_name, 'assets')
            tgt_path = os.path.join(config["site_dir"],'MiniMaps', dir_name, 'assets') 
            if os.path.exists(tgt_path):
                os.remove(tgt_path)
            print (f'"{os.path.abspath(src_path)}" -> "{os.path.abspath(tgt_path)}"')

            if not os.path.exists(f'site/MiniMaps/{dir_name}'):
                os.makedirs(f'site/MiniMaps/{dir_name}')
            shutil.copyfile(os.path.abspath(f'{self.data_dir}/{dir_name}/markers.js'), os.path.abspath(f'{config["site_dir"]}/MiniMaps/{dir_name}/markers.js'))
            if config['site_dir'].startswith('/home/runner'):
                shutil.move(os.path.abspath(src_path), os.path.abspath(tgt_path))
                mkdocs_utils.log.warn(f'Github Action - Moving assets')
            else:
                os.symlink(os.path.abspath(src_path), os.path.abspath(tgt_path), True)
                mkdocs_utils.log.warn(f'local - creating symlinks')
        return

    def on_page_content(self, html, page, config, files):
        if (page.url.startswith('MiniMaps') and page.title != 'Index'):
            html += '\n<div id="map"/>\n<script type="text/javascript" id="myJSON" src="./markers.js"></script>\n'
            print("changed content")
        return html

    # def on_page_context(self, context, page, config, nav):
    #     return context

    # def on_post_page(self, output_content, page, config):
    #     return output_content

    # def on_files(self, files, config):
    #     # print('on_files', [file.src_path for file in files])
    #     return files

    # def on_nav(self, nav, config, files):
    #     return nav

    # def on_env(self, env, config, files):
    #     return env


    # def on_pre_template(self, template, template_name, config):
    #     return template

    # def on_template_context(self, context, template_name, config):
    #     return context
    
    # def on_post_template(self, output_content, template_name, config):
    #     return output_content
    
    # def on_pre_page(self, page, config, files):
    #     return page

    # def on_page_read_source(self, page, config):
    #     return ""

    # def on_page_markdown(self, markdown, page, config, files):
    #     return markdown