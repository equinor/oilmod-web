export const navigation = {
  "name": "Web applications",
  "groups": [
    {
      "name": "Application 1",
      "items": [
        {
          "id": "a11",
          "name": "Application 1.1",
          "svgIcon": false,
          "icon": "build",
          "command": {
            "type": "navigate",
            "arguments": [
              "a11"
            ]
          }
        },
        {
          "id": "a12",
          "name": "Application 1.2",
          "svgIcon": false,
          "icon": "attach_money",
          "command": {
            "type": "navigate",
            "arguments": [
              "a12"
            ]
          }
        }
      ]
    },
    {
      "name": "Application 2",
      "external": false,
      "items": [
        {
          "id": "a2",
          "name": "Application 2",
          "svgIcon": false,
          "icon": "train",
          "command": {
            "type": "navigate",
            "arguments": [
              "a2"
            ]
          }
        }
      ]
    },
    {
      "name": "Application 3",
      "items": [
        {
          "id": "a3",
          "name": "Application 3",
          "svgIcon": false,
          "icon": "local_library",
          "command": {
            "type": "externalLinkNewWindow",
            "arguments": []
          }
        }
      ]
    }
  ]
}

export const subNavigation = {
  "name": "Application 2",
  "groups": [
    {
      "name": null,
      "items": [
        {
          "icon": "date_range",
          "name": "Section 1",
          "command": {
            "type": "internalLink",
            "arguments": [
              "1"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "format_list_bulleted",
          "name": "Section 2",
          "command": {
            "type": "internalLink",
            "arguments": [
              "2"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "train",
          "name": "Section 3",
          "command": {
            "type": "internalLink",
            "arguments": [
              "3"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "access_time",
          "name": "Section 4",
          "command": {
            "type": "internalLink",
            "arguments": [
              "4"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "description",
          "name": "Section 5",
          "command": {
            "type": "internalLink",
            "arguments": [
              "5"
            ]
          },
          "svgIcon": false,
          "subItems": []
        }
      ],
      "hasDivider": false,
      "svgIcon": false,
      "icon": null
    },
    {
      "name": null,
      "items": [
        {
          "icon": "train",
          "name": "SubSection 1",
          "command": {
            "type": "internalLink",
            "arguments": [
              "11"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "person",
          "name": "SubSection 2",
          "command": {
            "type": "internalLink",
            "arguments": [
              "12"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "business",
          "name": "SubSection 3",
          "command": {
            "type": "internalLink",
            "arguments": [
              "SubSection 13"
            ]
          },
          "svgIcon": false,
          "subItems": []
        },
        {
          "icon": "settings",
          "name": "SubSection 4",
          "command": {
            "type": "internalLink",
            "arguments": [
              "4"
            ]
          },
          "svgIcon": false,
          "subItems": []
        }
      ],
      "hasDivider": true,
      "svgIcon": false,
      "icon": null
    }
  ]
};
