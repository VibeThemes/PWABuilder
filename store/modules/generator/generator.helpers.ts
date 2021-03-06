import colorConverter from '~/utils/color-converter';
import { Icon, RelatedApplication, CodeError } from '~/store/modules/generator';

export const helpers = {
  MEMBER_PREFIX: 'mjs_',
  COLOR_OPTIONS: {
    none: 'none',
    transparent: 'transparent',
    pick: 'pick',
  },

  async isValidUrl(siteUrl: string): Promise<any> {
    /*try {
      return await fetch(siteUrl, {
        mode: 'no-cors'
      });

      // return /^(http|https):\/\/[^ "]+$/.test(siteUrl);
    }
    catch(err) {
      console.error('error in helper', err, err.message);
      return err;
    }*/

    try {
      return await fetch(siteUrl, {
        mode: 'no-cors',
        credentials: 'include',
      });
    } catch (err) {
      return err;
    }
  },

  async isValidScreenshotUrl(siteUrl: string): Promise<any> {
    console.log('SiteURL', siteUrl);
    try {
      var response = await fetch(siteUrl, {
        mode: 'no-cors',
        credentials: 'include',
      });
      if (response.status > 400) return false;
      else return true;
    } catch (err) {
      return false;
    }
  },
  getImageIconSize(aSrc: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve({ width: -1, height: -1 });
      }

      let tmpImg = document.createElement('img');
      tmpImg.onload = () => {
        resolve({
          width: tmpImg.width,
          height: tmpImg.height,
        });
      };

      tmpImg.src = aSrc;
    });
  },

  prepareIconsUrls(icons: Icon[], baseUrl: string) {
    return icons.map((icon) => {
      if (!icon.src.includes('http') && !icon.src.includes('data:image')) {
        // Create an absolute path to the icon.
        // Developer note: changing this code? Make sure it works for images on the following URLs:
        // - Analyzed URL https://www.sensoryapphouse.com/abstract4-pwa-xbox/index.html -> valid image https://www.sensoryapphouse.com/abstract4-pwa-xbox/images/abstract-512.png
        icon.src = new URL(icon.src, baseUrl).href;

        //remove posible trailing/leading slashes
        icon.src = `${icon.src.replace(/^\/+/g, '')}`;
      }
      return icon;
    });
  },

  async getImageDataURI(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onload = (aImg: any) => {
        const result: string = aImg.target.result;
        resolve(result);
      };

      reader.readAsDataURL(file);
    });
  },

  hasRelatedApplicationErrors(app: RelatedApplication): string | undefined {
    if (!app.platform) {
      return 'error.enter_platform';
    }

    if (!app.url && !app.id) {
      return 'error.enter_url';
    }

    const urlRegExpr = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.?[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if (app.url && !urlRegExpr.test(app.url)) {
      return 'error.enter_valid_url';
    }

    return;
  },

  fixColorFromServer(color: string | null): string {
    if (!color) {
      return '';
    }

    return '#' + colorConverter.toHexadecimal(color).slice(4, 10);
  },

  sumIssues(errors: CodeError[] | null): number {
    if (!errors) {
      return 0;
    }

    let total = 0;
    errors.forEach((error) => {
      if (error.issues && error.issues.length) {
        total += error.issues.length;
      }
    });

    return total;
  },
};
