class LatestSection:
    @staticmethod
    def find(sections: list) -> str:
        known_sections = [
            "introduction",
            "profile",
            "typology",
            "characteristics",
            "foundation",
            "model",
            "slate",
            "accessibility",
            "design",
            "instruction",
            "playability",
            "assessment",
            "justification"
        ]
        return max(sections, key=lambda x: known_sections.index(x))
