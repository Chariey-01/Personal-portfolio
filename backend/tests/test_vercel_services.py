import json
from pathlib import Path

from vercel_entry import ApiPrefixMiddleware

ROOT = Path(__file__).resolve().parents[2]


def test_services_config_exposes_the_site_and_api_without_a_binding():
    config = json.loads((ROOT / "vercel.json").read_text())
    assert "framework" not in config
    assert "buildCommand" not in config
    assert "outputDirectory" not in config
    assert set(config["services"]) == {"backend", "frontend"}

    backend = config["services"]["backend"]
    frontend = config["services"]["frontend"]
    assert backend == {
        "root": "backend",
        "framework": "flask",
        "entrypoint": "vercel_entry:app",
    }
    assert frontend["root"] == "."
    assert frontend["framework"] == "vite"
    assert frontend["buildCommand"] == "npm run build"
    assert frontend["outputDirectory"] == "dist"
    assert "bindings" not in backend
    assert "bindings" not in frontend

    api_rule, site_rule = config["rewrites"]
    assert api_rule == {"source": "/api/(.*)", "destination": {"service": "backend"}}
    assert site_rule == {"source": "/(.*)", "destination": {"service": "frontend"}}


def test_service_entry_accepts_prefixed_and_stripped_api_paths():
    seen = []

    def application(environ, start_response):
        seen.append(environ["PATH_INFO"])
        start_response("200 OK", [])
        return [b"ok"]

    middleware = ApiPrefixMiddleware(application)
    middleware({"PATH_INFO": "/api/projects"}, lambda status, headers: None)
    middleware({"PATH_INFO": "/projects"}, lambda status, headers: None)
    middleware({"PATH_INFO": "/"}, lambda status, headers: None)
    assert seen == ["/api/projects", "/api/projects", "/api"]
