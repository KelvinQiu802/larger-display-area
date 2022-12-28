import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import isNumber from "is-number";

interface WidthSetting {
	width: string;
}

const DEFAULT_SETTINGS: WidthSetting = {
	width: "default",
};

function changeWidth(value: string): void {
	const root = document.querySelector(":root");
	if (root) {
		if (value === "") {
			value = "1000"; // default
		}
		document.body.style.setProperty("--file-line-width", `${value}px`);
	}
}

export default class MyPlugin extends Plugin {
	settings: WidthSetting;

	async onload() {
		await this.loadSettings();

		changeWidth(this.settings.width);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {
		changeWidth("700"); // back to default value
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for Larger Display Area",
		});

		new Setting(containerEl)
			.setName("Display Width")
			.setDesc("The width(px) you like to use to display your content.")
			.addText((text) =>
				text
					.setPlaceholder("1000")
					.setValue(this.plugin.settings.width)
					.onChange(async (value) => {
						this.plugin.settings.width = value;
						await this.plugin.saveSettings();

						// Validation
						if (value !== "" && !isNumber(value)) {
							alert("The width must be an integer!");
							return;
						}

						// Change CSS Var
						changeWidth(value);
					})
			);
		containerEl.createEl("a", {
			href: "https://github.com/KelvinQiu802/larger-display-area",
			text: "Star this project on Github!",
		});
	}
}
