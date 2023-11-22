/**
 * Defines icon used by svgHelper
 *
 * @export
 * @enum {number}
 */
export enum SearchSvgIcon {  
    Refresh,
    Filter,
    ArrowDown,
    ArrowUp,
    ArrowRight,
    ArrowLeft,
    SortAscending,
    SortDescending
}
  
import { html } from "lit";

/**
 * returns an svg
 *
 * @param svgIcon defined by name
 * @param color hex value
 */
export const getInternalSvg = (svgIcon: SearchSvgIcon) => {
    switch (svgIcon) {
    
        case SearchSvgIcon.Refresh:
            return html`
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 2048 2048" focusable="false"><path d="M1297 38q166 45 304 140t237 226 155 289 55 331q0 141-36 272t-103 245-160 207-208 160-245 103-272 37q-141 0-272-36t-245-103-207-160-160-208-103-244-37-273q0-140 37-272t105-248 167-212 221-164H256V0h512v512H640V215q-117 56-211 140T267 545 164 773t-36 251q0 123 32 237t90 214 141 182 181 140 214 91 238 32q123 0 237-32t214-90 182-141 140-181 91-214 32-238q0-150-48-289t-136-253-207-197-266-124l34-123z"></path></svg>
        `;

        case SearchSvgIcon.Filter:
            return html`
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 2048 2048" focusable="false"><path d="M2048 128v219l-768 768v805H768v-805L0 347V128h2048zm-128 128H128v37l768 768v731h256v-731l768-768v-37z"></path></svg>
        `;

        case SearchSvgIcon.ArrowDown:
            return html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 2048 2048" focusable="false"><path d="M0 640h2048L1024 1664 0 640z"></path></svg>`;

        case SearchSvgIcon.ArrowUp:
            return html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 2048 2048" focusable="false"><path d="M1024 384l1024 1024H0L1024 384z"></path></svg>`;

        case SearchSvgIcon.SortAscending:
            return html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 2048 2048" focusable="false"><path d="M3 483l317-318 317 318-90 90-163-163v1510H256V410L93 573 3 483zm1277-99v128H768V384h512zm384 384v128H768V768h896zm-896 384h1280v128H768v-128z"></path></svg>`;
    
        case SearchSvgIcon.SortDescending:
            return html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 2048 2048" focusable="false"><path d="M384 1638l163-163 90 90-317 318L3 1565l90-90 163 163V128h128v1510zm384-358v-128h512v128H768zm0-384V768h896v128H768zm0-512h1280v128H768V384z"></path></svg>`;
    
        case SearchSvgIcon.ArrowRight:
            return html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 2048 2048" focusable="false"><path d="M515 1955l930-931L515 93l90-90 1022 1021L605 2045l-90-90z"></path></svg>`;

        case SearchSvgIcon.ArrowLeft:
            return html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 2048 2048" focusable="false"><path d="M1443 2045L421 1024 1443 3l90 90-930 931 930 931-90 90z"></path></svg>`;
    }
};
  