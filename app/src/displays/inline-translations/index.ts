import { defineDisplay } from '@directus/extensions';
import DisplayInlineTranslations from './inline-translations.vue';
import { useFieldsStore } from '@/stores/fields';

export default defineDisplay({
	id: 'inline-translations',
	name: '$t:displays.translations.translations',
	description: '$t:displays.translations.description',
	icon: 'translate',
	component: DisplayInlineTranslations,
	options: ({ collection }) => {
		const fieldStore = useFieldsStore();
		const fields = fieldStore.getFieldsForCollection(collection);
		return [
			{
				field: 'languageField',
				name: '$t:displays.translations.language_field',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: fields.map(({ field, name }) => ({ text: name, value: field })),
					},
					width: 'half',
				},
			},
		];
	},
	types: ['string', 'text'],
	localFields: (options) => {
		return [options.languageField];
	},
});
