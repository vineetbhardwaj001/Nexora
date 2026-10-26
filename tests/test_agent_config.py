#!/usr/bin/env python3
"""Lightweight structural checks for the Nexora starter repository."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class NexoraStructureTests(unittest.TestCase):
    def test_skill_registry_is_valid(self):
        data = json.loads((ROOT / ".agent/config/skills.json").read_text(encoding="utf-8"))
        self.assertIsInstance(data.get("skills"), dict)
        self.assertIn(data.get("autonomy"), {"ask-first", "guided", "autopilot-local"})
        self.assertIn("backend-preserving-frontend", data["skills"])
        self.assertTrue(data.get("policies", {}).get("backend_read_only_by_default"))

    def test_required_guidance_exists(self):
        required = [
            "AGENTS.md",
            ".agent/CORE.md",
            ".agent/workflows/setup.md",
            ".agent/workflows/uiux-reference-analysis.md",
            ".agent/workflows/backend-preserving-frontend.md",
            ".agent/workflows/frontend-structure.md",
            ".agents/skills/ux-ui-design/SKILL.md",
            ".agents/skills/backend-preserving-frontend/SKILL.md",
            ".github/copilot-instructions.md",
            "kilo.jsonc",
            "LICENSE",
            "README.md",
        ]
        for relative in required:
            with self.subTest(path=relative):
                self.assertTrue((ROOT / relative).is_file(), f"Missing {relative}")

    def test_skill_status_values_are_valid(self):
        data = json.loads((ROOT / ".agent/config/skills.json").read_text(encoding="utf-8"))
        allowed = {"enabled", "ask-first", "disabled"}
        invalid = {name: status for name, status in data["skills"].items() if status not in allowed}
        self.assertEqual(invalid, {})


if __name__ == "__main__":
    unittest.main(verbosity=2)

    def test_error_validation_and_message_skills_exist_and_are_enabled(self):
        data = json.loads((ROOT / ".agent/config/skills.json").read_text(encoding="utf-8"))
        required = [
            "error-handling",
            "validation",
            "meaningful-product-messages",
        ]
        for skill in required:
            with self.subTest(skill=skill):
                self.assertEqual(data["skills"].get(skill), "enabled")
                self.assertTrue(
                    (ROOT / ".agents/skills" / skill / "SKILL.md").is_file(),
                    f"Missing skill file for {skill}",
                )

