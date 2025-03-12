<script setup lang="ts">
import { computed } from 'vue';
import { i18n } from '@/lang';
import { isNil } from 'lodash';

interface Translation {
	languages_code: { code: string };
	[key: string]: any;
}

interface Props {
	value?: string | { translations: Translation[] } | Translation[];
	field: string;
}

const props = defineProps<Props>();

// Compute the array of translations regardless of the original shape
const translationsArray = computed<Translation[]>(() => {
	if (Array.isArray(props.value)) {
		return props.value;
	}

	if (props.value && typeof props.value === 'object' && 'translations' in props.value) {
		return (props.value as { translations: Translation[] }).translations || [];
	}

	return [];
});

// Get the active language from the i18n instance
const activeLanguage = computed(() => i18n.global.locale.value);

// Compute the display item based on the current language and the given field
const displayItem = computed(() => {
	if (typeof props.value === 'string') {
		return props.value;
	}

	const translation = translationsArray.value.find((t) => t.languages_code?.code === activeLanguage.value);

	return translation?.[props.field] || null;
});

// Process each translation to include the completeness progress and relevant text
const translations = computed(() => {
	return translationsArray.value.map((item) => {
		const keys = Object.keys(item);
		const filledCount = keys.filter((key) => !isNil(item[key]) && item[key] !== '').length;
		const progress = Math.round((filledCount / keys.length) * 100);
		return {
			lang: item.languages_code?.code,
			text: item[props.field] || null,
			progress,
		};
	});
});
</script>

<template>
	<!-- If the value is a raw string, show it directly -->
	<span v-if="typeof value === 'string'">
		{{ value }}
	</span>

	<!-- If no translations (or raw string) are available, show a placeholder -->
	<div v-else-if="!value || (!Array.isArray(value) && !value.translations)">
		<value-null />
	</div>

	<!-- Otherwise, display the current translation and the translations menu -->
	<div v-else class="display-translations">
		<div class="current-translation">
			<template v-if="displayItem">
				{{ displayItem }}
			</template>
			<template v-else>
				<value-null />
			</template>
		</div>

		<v-menu class="menu" show-arrow :disabled="translations.length === 0">
			<template #activator="{ toggle, deactivate, active }">
				<v-icon small class="icon" :class="{ active }" name="info" @click.stop="toggle" @focusout="deactivate" />
			</template>

			<v-list class="links">
				<v-list-item v-for="item in translations" :key="item.lang">
					<v-list-item-content>
						<div class="header">
							<div class="lang">
								<v-icon name="translate" small />
								{{ item.lang }}
							</div>
							<v-progress-linear v-tooltip="`${item.progress}%`" :value="item.progress" colorful />
						</div>
						<div class="translation-text">
							<template v-if="item.text">
								{{ item.text }}
							</template>
							<value-null v-else />
						</div>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>

<style lang="scss" scoped>
.v-list {
	width: 300px;
}

.display-translations {
	display: inline-flex;
	max-width: 100%;
	align-items: center;

	.icon {
		color: var(--theme--foreground-subdued);
		opacity: 0;
		transition: opacity var(--fast) var(--transition);
	}

	&:hover .icon,
	.icon.active {
		opacity: 1;
	}
}

.header {
	display: flex;
	gap: 20px;
	align-items: center;
	justify-content: space-between;
	color: var(--theme--foreground-subdued);
	font-size: 12px;

	.lang {
		font-weight: 600;
	}

	.v-icon {
		margin-right: 4px;
	}

	.v-progress-linear {
		flex: 1;
		width: unset;
		max-width: 100px;
		border-radius: 4px;
	}
}

.v-list-item-content {
	padding-top: 4px;
	padding-bottom: 2px;
}

.v-list-item:not(:first-child) {
	.header {
		padding-top: 8px;
		border-top: var(--theme--border-width) solid var(--theme--border-color-subdued);
	}
}

.current-translation {
	color: var(--theme--foreground-primary);
	margin-right: 8px;
}
</style>
