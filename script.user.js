// ==UserScript==
// @name         Circles model picker
// @version      1.0.0
// @match        https://aistore.circles.life/*
// @grant        none
// ==/UserScript==

(function () {
    const KEY = "circles_model_id";
    const URL = "https://aistore-api.circles.life/v1/sgcircles/aistore/chatbot/completions";
    const HTML = `<div class="flex-container">
                                <select id="circles_model_id" class="text_pole wide100p">
                                    <optgroup label="OpenAI">
                                        <option value="gpt-5.4">GPT-5.4</option>
                                        <option value="gpt-5.2">GPT-5.2</option>
                                        <option value="gpt-5.2-thinking">GPT-5.2 Thinking</option>
                                        <option value="gpt-5.1">GPT-5.1</option>
                                        <option value="gpt-5">GPT-5</option>
                                        <option value="gpt-5-mini">GPT-5 Mini</option>
                                        <option value="gpt-4.1">GPT-4.1</option>
                                    </optgroup>
                                    <optgroup label="Gemini">
                                        <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                                        <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                                        <option value="gemini-3-pro-thinking">Gemini 3 Pro Thinking</option>
                                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                    </optgroup>
                                    <optgroup label="Claude">
                                        <option value="claude-opus-4-6">Claude Opus 4.6</option>
                                        <option value="claude-opus-4-6-thinking">Claude Opus 4.6 Thinking</option>
                                        <option value="claude-opus-4-5">Claude Opus 4.5</option>
                                        <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
                                        <option value="claude-sonnet-4-5-thinking">Claude Sonnet 4.5 Thinking</option>
                                        <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                                        <option value="claude-haiku-4-5">Claude Haiku 4.5</option>
                                    </optgroup>
                                    <optgroup label="DeepSeek">
                                        <option value="deepseek-chat">DeepSeek-V3.2</option>
                                        <option value="deepseek-reasoner">DeepSeek-V3.2 Thinking</option>
                                    </optgroup>
                                    <optgroup label="Qwen">
                                        <option value="qwen3.5-plus">Qwen 3.5 Plus</option>
                                        <option value="qwen3.5-plus-thinking">Qwen 3.5 Plus Thinking</option>
                                        <option value="qwen3-max">Qwen 3 Max</option>
                                        <option value="qwen3-max-thinking">Qwen 3 Max Thinking</option>
                                        <option value="qwen-plus">Qwen Plus</option>
                                        <option value="qwen-flash">Qwen Flash</option>
                                    </optgroup>
                                    <optgroup label="Perplexity">
                                        <option value="sonar-pro">Perplexity Sonar Pro</option>
                                    </optgroup>
                                </select>
                            </div>`;

    function model() {
        return localStorage.getItem(KEY) || "gpt-5.4";
    }

    function rewrite(body) {
        if (typeof body !== "string") return body;
        try {
            const data = JSON.parse(body);
            if (!data || typeof data !== "object") return body;
            data.ai_model = model();
            return JSON.stringify(data);
        } catch {
            return body;
        }
    }

    function mount() {
        if (document.getElementById(KEY) || !document.body) return;
        const box = document.createElement("div");
        box.style.cssText = "position:fixed;top:12px;right:12px;z-index:2147483647;padding:8px 10px;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.15)";
        box.innerHTML = HTML;
        const sel = box.querySelector("#circles_model_id");
        sel.value = model();
        sel.addEventListener("change", () => localStorage.setItem(KEY, sel.value));
        document.body.appendChild(box);
    }

    const fetch0 = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === "string" ? input : input?.url;
        if (url === URL && init?.body) init.body = rewrite(init.body);
        return fetch0.call(this, input, init);
    };

    const open0 = XMLHttpRequest.prototype.open;
    const send0 = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._circlesUrl = url;
        return open0.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
        if (this._circlesUrl === URL) body = rewrite(body);
        return send0.call(this, body);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount, { once: true });
    } else {
        mount();
    }
})();
