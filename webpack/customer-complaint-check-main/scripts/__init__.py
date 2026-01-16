# -*- coding: utf-8 -*-

"""
Scripts module for customer complaint classification tasks
"""

from .process_excel import main as process_excel_main
from .evaluate_tags import main as evaluate_results_main

__all__ = ["process_excel_main", "evaluate_results_main"]