export default class Redirects {
    private redirectList: Redirect[];
    private activeRedirect: string | null;

    constructor() {
        if (localStorage.length === 2) {
            this.redirectList = JSON.parse(localStorage.getItem("redirectList"));
            this.activeRedirect = localStorage.getItem("activeRedirect");

            if (
                !this.redirectList.find(
                    (redirect) => redirect.id === this.activeRedirect
                )
            ) {
                this.activeRedirect = null;
            }
        } else {
            this.redirectList = [];
            this.activeRedirect = null;
        }
    }

    public addRedirect(uri: string): string {
        if (this.redirectList.find((redirect) => redirect.uri === uri)) {
            throw new Error(`Redirect with URI "${uri}" already exists!`);
        }

        const id = Math.random().toString(36).slice(-6);
        this.redirectList.push({
            id: id,
            uri: uri
        });

        this.updateLocalStorage();

        return id;
    }

    public removeRedirect(id: string): void {
        const index = this.redirectList.findIndex((redirect) => redirect.id === id);

        // Don't need to do anything if we can't find it :3
        if (index === -1) return;

        if (id === this.activeRedirect) {
            this.activeRedirect === null;
        }
        this.redirectList.splice(index, 1);

        this.updateLocalStorage();

        return;
    }

    public setActive(id: string): void {
        if (!this.redirectList.find((redirect) => redirect.id === id))
            throw new Error(`Could not find redirect with id "${id}"`);

        this.activeRedirect = id;

        this.updateLocalStorage();
    }

    public getUri(id: string): Redirect {
        const redirect = this.redirectList.find((redirect) => redirect.id === id);

        if (!redirect) throw new Error(`Could not find redirect with id "${id}"`);

        return redirect;
    }

    private updateLocalStorage(): void {
        localStorage.setItem("redirectList", JSON.stringify(this.redirects));
        localStorage.setItem("activeRedirect", this.activeRedirect);
    }

    public reset(): void {
        localStorage.clear();
    }

    get redirects(): typeof this.redirectList {
        return this.redirectList;
    }

    get active(): Redirect | null {
        if (this.activeRedirect === null) {
            return null;
        } else {
            return this.getUri(this.activeRedirect);
        }
    }
}

type Redirect = { id: string; uri: string };
