import { Component } from "preact";

export default class RedirectTable extends Component {
    state: {
        redirects: { id: string; uri: URL }[];
        active: string | null;
        uriInput: {
            uri: URL | null;
            string: string;
        };
    } = {
        redirects: [],
        active: null,
        uriInput: {
            uri: null,
            string: ""
        }
    };

    constructor() {
        super();

        this.getLocalStorage();
    }

    onInput = (ev: InputEvent) => {
        let input = (ev.currentTarget as HTMLInputElement).value;

        if (input === "") {
            this.setState({ uriInput: { uri: null } });
            return;
        }

        if (!(input.startsWith("http://") || input.startsWith("https://"))) {
            input = `http://${input}`;
        }

        try {
            const uri = new URL("?code=xxxxxxxxxxxxxxxx", input);
            this.setState({ uriInput: { uri: uri } });
        } catch (err) {
            this.setState({ uriInput: { uri: null } });
        }
    };

    onSubmit = (ev: SubmitEvent) => {
        ev.preventDefault();

        let redirectUri: URL;
        try {
            redirectUri = new URL(
                this.state.uriInput.uri.origin + this.state.uriInput.uri.pathname
            );
        } catch (err) {
            console.error("Invalid URL");
            return;
        }

        const redirects = this.state.redirects;
        if (redirects.find((redirect) => redirect.uri.href === redirectUri.href)) {
            console.error("URL already exists in list");
            return;
        }

        redirects.push({
            id: Math.random().toString(36).slice(-6),
            uri: redirectUri
        });

        this.setState({
            redirects: redirects,
            uriInput: { uri: null, string: "" }
        });

        this.updateLocalStorage();
    };

    getLocalStorage = () => {
        const redirectsRaw = JSON.parse(localStorage.getItem("redirects"));

        this.setState({
            redirects: (redirectsRaw !== null ? redirectsRaw : []).map(
                (redirect: any) => {
                    return {
                        id: redirect.id,
                        uri: new URL(redirect.uri)
                    };
                }
            ),
            active: localStorage.getItem("active")
        });
    };

    updateLocalStorage = () => {
        localStorage.setItem(
            "redirects",
            JSON.stringify(
                this.state.redirects.map((redirect) => {
                    return {
                        id: redirect.id,
                        uri: redirect.uri.origin + redirect.uri.pathname
                    };
                })
            )
        );
        localStorage.setItem("active", this.state.active);
    };

    clearLocalStorage = (ev: any) => {
        this.setState({
            redirects: [],
            active: null
        });
        localStorage.clear();
    };

    render() {
        return (
            <>
                {this.state.redirects.length > 0 ? (
                    <button style="float: right" onClick={this.clearLocalStorage}>Delete all</button>
                ) : (
                    <></>
                )}
                <ul>
                    {this.state.redirects.map((redirect) => (
                        <li key={redirect.id}>{redirect.uri.toString()}</li>
                    ))}
                </ul>
                <form onSubmit={this.onSubmit}>
                    <label for="uriInput">Add new redirect URI</label>
                    <input
                        type="text"
                        name="uriInput"
                        id="uriInput"
                        autocomplete="off"
                        value={this.state.uriInput.string}
                        onInput={this.onInput}
                    />
                    <p>Redirect URI will look like this:</p>
                    <pre>
                        <samp>
                            {this.state.uriInput.uri !== null
                                ? this.state.uriInput.uri.toString()
                                : "http://example?code=xxxxxxxxxxxxxxxx"}
                        </samp>
                    </pre>
                    <button type="submit">Add Redirect</button>
                </form>
            </>
        );
    }
}
