import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";
import { Consts } from "../../../helpers/fileManagerHelpers.js";

const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager").dxFileManager({
            itemView: {
                mode: "details",
                showParentFolder: false
            },
            fileProvider: [
                {
                    name: "Folder 1",
                    isFolder: true
                },
                {
                    name: "1.txt",
                    isFolder: false,
                    size: 0
                },
                {
                    name: "2.txt",
                    isFolder: false,
                    size: 200
                },
                {
                    name: "3.txt",
                    isFolder: false,
                    size: 1024
                },
                {
                    name: "4.txt",
                    isFolder: false,
                    size: 1300
                }
            ]
        });

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

const getFileSizeCellValueInDetailsView = ($element, rowIndex) => getCellValueInDetailsView($element, rowIndex, 4);

const getCellValueInDetailsView = ($element, rowIndex, columnIndex) => {
    return $element.find(`tr.${Consts.GRID_DATA_ROW_CLASS}[aria-rowindex=${rowIndex}] td`)
        .eq(columnIndex)
        .text();
};

QUnit.module("Details View", moduleConfig, () => {

    test("Format file sizes", function(assert) {
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 1).trim(), "", "Folder shouldn't display own size.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 2), "0 B", "Incorrect formating of size column.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 3), "200 B", "Incorrect formating of size column.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 4), "1 KB", "Incorrect formating of size column.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 5), "1.3 KB", "Incorrect formating of size column.");
    });

    test("Using custom formats of JSON files", function(assert) {
        const fileSystem = [
            {
                title: "Folder",
                noFolder: true,
                myDate: "2/2/2000"
            },
            {
                title: "Title",
                noFolder: false,
                myDate: "1/1/2000",
                count: 55
            }
        ];
        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option({
            "fileProvider": fileSystem,
            "nameExpr": "title",
            "isFolderExpr": "noFolder",
            "dateModifiedExpr": "myDate",
            "sizeExpr": "count"
        });
        this.clock.tick(400);

        assert.ok(getCellValueInDetailsView(this.$element, 1, 2).indexOf("Folder") === 0);
        assert.equal(getCellValueInDetailsView(this.$element, 1, 3).trim(), "2/2/2000");
        assert.equal(getCellValueInDetailsView(this.$element, 1, 4).trim(), "");

        assert.ok(getCellValueInDetailsView(this.$element, 2, 2).indexOf("Title") === 0);
        assert.equal(getCellValueInDetailsView(this.$element, 2, 3).trim(), "1/1/2000");
        assert.equal(getCellValueInDetailsView(this.$element, 2, 4).trim(), "55 B");
    });

});
