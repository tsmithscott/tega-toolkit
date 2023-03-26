from unittest import TestCase, main
from utilities.latestsection import LatestSection


class TestLatestSection(TestCase):
    def test(self):
        test_data = ["typology", "introduction"]
        actual = LatestSection.find(test_data)
        
        self.assertEqual("typology", actual)

if __name__ == "__main__":
    main()
