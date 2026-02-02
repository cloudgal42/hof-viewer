# Hall of Fame Viewer
A React webapp that utilizes the [Hall Of Fame (HoF)](https://mods.paradoxplaza.com/mods/90641/Windows) API to allow users to browse and view city screenshots by creator name or ID.

Features: 
- Group screenshots by city name
- View screenshot details, such as views & favorites count, as well as city stats such as milestone and population.
- View, search and filter playset used.
- View render settings used for that screenshot.

### Acknowledgements
- [toverux](https://github.com/toverux/) for the original Hall of Fame mod for Cities: Skylines 2

## Development
1. Install NodeJS 22 or later [here](https://nodejs.org/en/download)
2. Clone the repository:
    ```
    git clone https://github.com/cloudgal42/hof-viewer.git
    ```
3. Create a new `.env.locals` file with the following content:
    ```
   VITE_HOF_SERVER=hof-server-link-here
   ```
   For developing purposes, the test server should be used.
4. Install all dependencies via `npm install`.
5. Either:
    - Run the development server by invoking `npm run dev`
    - Build the project by invoking `npm run build`
    - Run the preview (in production mode) by invoking `npm run preview`. Note that one needs to build the project before doing this.

## License
This project is licensed under the GPLv3. Read more [here.](https://github.com/cloudgal42/hof-viewer/blob/master/LICENSE)
