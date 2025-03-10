import { defineDisplay } from '@directus/extensions';
import DisplayInlineTranslations from "./inline-translations.vue"

export default defineDisplay({
	id: 'inline-translations',
	name: '$t:displays.translations.translations',
	description: '$t:displays.translations.description',
	icon: 'translate',
	component: DisplayInlineTranslations,
	options: null,
	types: ["string", "text"],
	localFields: ["languages_code.*"]
});
