All components supports localization (i.e. get translated to a specific language) through the [Microsoft Graph Toolkit](https://learn.microsoft.com/en-us/graph/toolkit/customize-components/localization) localization feature. The localization process covers the following elements:

- Static labels in components (i.e. translations).
- Use defined labels from component attributes data (ex: filter names, tab names, etc.)

### Localize components

The language is managed globally on the page for all components. By default all components are displayed in English using `en-us` locale. Use the `pnp-language-provider` component and `locale` attribute to change the language:

```html
<pnp-language-provider id="languageSwitcher" locale="fr-fr">
</pnp-language-provider>
```

You can also programmatically change the language using Javascript:

```javascript
document.getElementById("languageSwitcher").setAttribute('locale','ro-ro')
```

!!! notice 
    - You can use the `show-picker` attribute to test the language switching behavior.
    - If no language provider is present on the page, the default language will be `en-us`.

### Localize data

You can also localize the data passed as attribute for specific components using localized string format like this:

```json
{
   "default":"Default string for en-us",
   [key: locale culture]: "FR",
}
```

The following components are localizable:

| Component | Property in configuration | 
| --------- | ------------------------- |
| `pnp-search-verticals` | `tabName`
| `pnp-search-filters` | `displayName`

_Example for search verticals_

```json
[
   {
      "key":"all",
      "tabName":{
         "default":"All",
         "fr-fr":"Tout le contenu",
         "ro-ro":"Toate"
      },
      "tabValue":"",
      "isLink":false,
      "linkUrl":null,
      "openBehavior":0
   },
]
```

!!! notice
    If the label shouldn't be localized, you can also use a string value instead of an object (Ex: ` "tabName": "Non localized value"`).
