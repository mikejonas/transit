# Project Setup Instructions

To ensure that your project is easily accessible to anyone who downloads the repository, follow these setup instructions:

## Set up Virtual Environment (venv)

First, create a virtual environment in this python directory

```bash
python3 -m venv transit
```

Activate the virtual environment using the appropriate command based on your operating system:

```bash
source transit/bin/activate # macOS and Linux
```
## Install Required Packages
```bash
pip install -r installed_packages.txt
```

## Create Jupyter Kernel

To create a Jupyter kernel for your virtual environment, run the following command:

```bash
python -m ipykernel install --user --name=transit --display-name="transit"
```
This will make the virtual environment accessible as a kernel named "transit" in Jupyter notebooks.

## Verify Python Version

Use a more recent python version like 3.9+. Install and configure [pyenv](https://github.com/pyenv/pyenv?tab=readme-ov-file#homebrew-in-macos) to manage python environments.

## Install Jupyter Extension in VSCode

This will allow you to work with Jupyter files in vscode. When you're in the Jupytr file, amke sure oyu use the transit Kernel. If you've followed the instructions above and you don't see it, try reloading vscode.