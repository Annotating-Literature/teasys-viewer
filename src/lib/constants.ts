import type { Category } from '$lib/types/annotation';

export const CATEGORIES: Category[] = [
	'language',
	'form',
	'intratextuality',
	'intertextuality',
	'context',
	'interpretation',
	'textual-variants',
	'questions'
];

export const CATEGORY_META: Record<
	Category,
	{ label: string; color: string; bg: string }
> = {
	language: { label: 'Language', color: '#2563eb', bg: '#dbeafe' },
	form: { label: 'Form', color: '#be185d', bg: '#fce7f3' },
	intratextuality: { label: 'Intratextuality', color: '#047857', bg: '#d1fae5' },
	intertextuality: { label: 'Intertextuality', color: '#b45309', bg: '#fef3c7' },
	context: { label: 'Context', color: '#6d28d9', bg: '#ede9fe' },
	interpretation: { label: 'Interpretation', color: '#b91c1c', bg: '#fee2e2' },
	'textual-variants': { label: 'Textual Variants', color: '#0369a1', bg: '#e0f2fe' },
	questions: { label: 'Questions', color: '#374151', bg: '#f3f4f6' }
};

export const LEVEL_1_ALLOWED_CATEGORIES = CATEGORIES.filter((c) => c !== 'interpretation');
