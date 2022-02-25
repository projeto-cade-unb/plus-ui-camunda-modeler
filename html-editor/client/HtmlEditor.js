import React, { Fragment } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

export default class HtmlEditorPlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasChanged: false,
    };
  }

  setText(data) {
    const camundaName = document.querySelector('#camunda-documentation');
    camundaName.textContent = data;

    console.log(camundaName);
  }

  componentDidMount() {
    const { subscribe } = this.props;

    subscribe('tab.saved', () => {
      this.setState({ hasChanged: false });
    });

    subscribe('bpmn.modeler.created', (event) => {
      const { modeler, tab } = event;
      const xml = tab.file.contents; // .replace(/(?:\r\n|\r|\n)/g, '');
      const nameFile = tab.name.replace('.bpmn', '');

      this.setState({ xml, nameFile });

      modeler.on('propertiesPanel.changed', ({ current: { element } }) => {
        // const documentations = elem.match(/<bpmn:documentation>(.+)<\/bpmn:documentation>/gm);

        let xml = event.tab.file.contents;
        const documentation = xml.matchAll(/<bpmn:documentation>(.+?)<\/bpmn:documentation>/gms);
        // .replace(/(?:\r\n|\r|\n)/g, '');

        const re = /<bpmn:documentation>(.+?)<\/bpmn:documentation>/gms;
        let m;

        do {
          m = re.exec(xml);
          if (m) {
            const documentationString = m[0].replace(/(?:\n)/g, '<br />');
            xml = xml.replace(m[0], documentationString);
          }
        } while (m);

        xml = xml.replace(/(?:\r\n|\r|\n)/g, '');


        const nameFile = event.tab.file.name.replace('.bpmn', '');

        this.setState({ xml, nameFile });
      });

      modeler.on('elements.changed', () => {
        this.setState({ hasChanged: true });
      });
    });
  }

  export() {
    const { xml, nameFile, hasChanged } = this.state;
    let textData = `<html><head><title>${nameFile}</title><style>body {font-family: "Arial", sans-serif;}.header input[type=text] {width: 500px;max-width: 100%;}.console textarea {width: 100%;min-height: 80px;border: none;padding: 0;}.canvas {border: solid 1px black;width: 70%;float: left;}.info {padding-left: 10px;border: solid 1px black;width: calc(30% - 20px);float: right;height: 600px;}</style></head><body><div class="canvas"><div id="js-canvas"></div></div><div class="info"><h3>Informações</h3><div class="properties-info"></div></div><!-- viewer --><script src="https://unpkg.com/bpmn-js@8.7.3/dist/bpmn-viewer.development.js"></script><!-- jquery (required for example only) --><script src="https://unpkg.com/jquery@3.3.1/dist/jquery.js"></script><!-- app --><script>var refKey = {id: 'ID',name: 'Nome',camunda_assignee: 'Responsável',camunda_candidateUsers: 'Função',camunda_candidateGroups: 'Candidate Groups',camunda_dueDate: 'Data Inicial',camunda_followUpDate: 'Data Final',camunda_priority: 'Prioridade',};var viewer = new BpmnJS({container: $("#js-canvas"),height: 600});var finalProperties = [];openFromXml();async function openFromXml() {const xml = '${xml}';mountProperties(xml);console.log(xml);try {await viewer.importXML(xml);viewer.get("canvas").zoom("fit-viewport");} catch (err) {console.error(err);}}function mountProperties(stringXml) {const body = stringXml.match(/<bpmn+([:a-z]|)+[Tt]ask.+?<\\/bpmn+([:a-z]|)+[Tt]ask/gm);let elementsProperties = [];body.map(elem => {const propertiesValues = elem.match(/(".+?")/gm);const properties = elem.match(/(([:a-zA-Z]+)(="))/gm);let elementsProperty = {};console.log(properties);const documentation = elem.match(/<bpmn:documentation>(.+)<\\/bpmn:documentation>/gm);console.log(documentation);properties.map((el, v) => {elementReplace = el.replace(" ", "").replace('="', "").replace(":", "_");elementsProperty[elementReplace] = propertiesValues[v].replaceAll('"', "");if (documentation) {let myDocumentation = documentation.join();const bold = myDocumentation.match(/\\*(.+)\\*/gm);const italic = myDocumentation.match(/\\_(.+)\\_/gm);const link = /\\[(https|http)?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)\\](.+)\\[\\]/gm.exec(myDocumentation);if(bold) {bold.map((el, v) => {myDocumentation = myDocumentation.replaceAll(el, \`<strong>\${el.substring(1, el.length - 1)}</strong>\`);});}if(italic) {italic.map((el, v) => {myDocumentation = myDocumentation.replaceAll(el, \`<em>\${el.substring(1, el.length - 1)}</em>\`);});}if(link) {const linkReplace = link[0];const intoLink = /\\[(.+)\\](.+)\\[\\]/gm.exec(linkReplace);myDocumentation = myDocumentation.replaceAll(linkReplace, \`<a href="\${intoLink[1]}" target="blank">\${intoLink[2]}</a>\`);}elementsProperty['Documentation'] = myDocumentation;}});finalProperties.push(elementsProperty);});console.log(body);}$("#js-open").click(function () {var url = $("#js-url").val();openFromUrl(url);});(function () {var str = window.location.search;var match = /(?:&|\\?)url=([^&]+)/.exec(str);if (match) {var url = decodeURIComponent(match[1]);$("#js-url").val(url); openFromUrl(url);}})();$(window).on("load", function () {$("#js-canvas").on("click", ".djs-element", function () {const elId = $(this).data("element-id");const myProperty = finalProperties.find(value => value.id === elId);let myText = "";if (myProperty) {const propertyNames = Object.keys(myProperty);myText += '<ul>';propertyNames?.map(k => {const elmentName = refKey[k] ? refKey[k] : k;if (elmentName != 'Documentation') {myText += "<li><strong>" + elmentName + "</strong>: " + myProperty[k] + "</li>";}});if (propertyNames.find(value => value === 'Documentation')) {myText += '</ul><h3>Documentation</h3>' + myProperty['Documentation'];}};$(".properties-info").html(myText);});});</script></html>`;
    // let textData = `<html><head><title>${nameFile}</title><style>body {font-family: "Arial", sans-serif;}.header input[type=text] {width: 500px;max-width: 100%;}.console textarea {width: 100%;min-height: 80px;border: none;padding: 0;}.canvas {border: solid 1px black;width: 70%;float: left;}.info {padding-left: 10px;border: solid 1px black;width: calc(30% - 20px);float: right;height: 600px;}</style></head><body><div class="canvas"><div id="js-canvas"></div></div><div class="info"><h3>Informações</h3><div class="properties-info"></div></div><!-- viewer --><script src="https://unpkg.com/bpmn-js@8.7.3/dist/bpmn-viewer.development.js"></script><!-- jquery (required for example only) --><script src="https://unpkg.com/jquery@3.3.1/dist/jquery.js"></script><!-- app --><script>var refKey = {id: 'ID',name: 'Nome',camunda_assignee: 'Responsável',camunda_candidateUsers: 'Função',camunda_candidateGroups: 'Candidate Groups',camunda_dueDate: 'Data Inicial',camunda_followUpDate: 'Data Final',camunda_priority: 'Prioridade',};var viewer = new BpmnJS({container: $("#js-canvas"),height: 600});var finalProperties = [];openFromXml();async function openFromXml() {const xml = '${xml}';mountProperties(xml);console.log(xml);try {await viewer.importXML(xml);viewer.get("canvas").zoom("fit-viewport");} catch (err) {console.error(err);}}function mountProperties(stringXml) {const body = stringXml.match(/<bpmn+([:a-z]|)+[Tt]ask.+?<\\/bpmn+([:a-z]|)+[Tt]ask/gm);let elementsProperties = [];body.map(elem => {const propertiesValues = elem.match(/(".+?")/gm);const properties = elem.match(/(([:a-zA-Z]+)(="))/gm);let elementsProperty = {};console.log(properties);const documentation = elem.match(/<bpmn:documentation>(.+)<\\/bpmn:documentation>/gm);properties.map((el, v) => {elementReplace = el.replace(" ", "").replace('="', "").replace(":", "_");elementsProperty[elementReplace] = propertiesValues[v].replaceAll('"', "");if(documentation){elementsProperty['Documentation'] = documentation;}});finalProperties.push(elementsProperty);});console.log(body);}$("#js-open").click(function () {var url = $("#js-url").val();openFromUrl(url);});(function () {var str = window.location.search;var match = /(?:\&|\\?)url=([^&]+)/.exec(str);if (match) {var url = decodeURIComponent(match[1]);$("#js-url").val(url);openFromUrl(url);}})();$(window).on("load", function () {$("#js-canvas").on("click", ".djs-element", function() {const elId = $(this).data("element-id");const myProperty = finalProperties.find(value => value.id === elId);let myText = "";if(myProperty){const propertyNames = Object.keys(myProperty);myText += '<ul>';propertyNames?.map(k => {const elmentName = refKey[k] ? refKey[k] : k; if(elmentName != 'Documentation') { myText += "<li><strong>" + elmentName + "</strong>: " + myProperty[k] + "</li>";}});if (propertyNames.find(value => value === 'Documentation')) {myText += '</ul><h3>Documentation</h3>' + myProperty['Documentation'];}};$(".properties-info").html(myText);});});</script></html>`;
    let blobData = new Blob([textData], { type: "text/html" });
    let url = window.URL.createObjectURL(blobData);

    if (hasChanged) {
      const result = confirm('Há alterações não salvas, deseja exportar esse projeto mesmo sem as últimas alterações?');
      if (result) {
        this.saveFile(nameFile + '.html', url);
      }
      return;
    }

    this.saveFile(nameFile + '.html', url);
  }

  saveFile(fileName, urlFile) {
    let a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    a.href = urlFile;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  render() {
    return (
      <Fragment>
        <Fill slot="toolbar">
          <a onClick={() => this.export()}>Exportar para HTML</a>
        </Fill>
      </Fragment>);
  }
}