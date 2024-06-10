from setuptools import setup, find_packages


setup(
    name='mkdocs-chivmaps-plugin',
    version='0.0.1a',
    description='A MkDocs Plugin for leaflets.js, specifically for Chivalry 2 Maps',
    long_description='',
    keywords='mkdocs',
    url='',
    author='Knutschbert',
    author_email='your email',
    license='MIT',
    python_requires='>=2.7',
    install_requires=[
        'mkdocs>=1.0.4'
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Intended Audience :: Information Technology',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3 :: Only',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9'
    ],
    packages=find_packages(),
    entry_points={
        'mkdocs.plugins': [
            'chivmaps = mkdocs_chivmaps_plugin.plugin:ChivMapsPlugin'
        ]
    }
)
