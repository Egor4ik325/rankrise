import { useEffect, useState } from "react";
import { ControlledTreeEnvironment, Tree } from "react-complex-tree";
import { Dropdown, Spinner } from "react-bootstrap";
// import "react-complex-tree/lib/style.css";
import api from "../client";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Categories = ({ selectedItems, setSelectedItems }) => {
  const [items, setItems] = useState(null);
  const [focusedItem, setFocusedItem] = useState();
  const [expandedItems, setExpandedItems] = useState([]);

  const fetchCategories = async () => {
    try {
      const categories = await api.categories.list();

      setItems(
        categories.results.reduce(
          (prev, category) => ({
            ...prev,
            [category.id]: {
              index: category.id,
              data: category.name,
              // Children
              hasChildren: true,
              children: [],
              // Properties
              canMove: false,
              canRename: false,
            },
          }),
          {
            root: {
              index: "root",
              hasChildren: true,
              children: categories.results.map((category) => category.id),
              // Properties
              canMove: false,
              canRename: false,
            },
          }
        )
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFocusItem = (item) => {
    setFocusedItem(item.index);
  };

  const handleExpandItem = async (item) => {
    // If children are already loaded
    if (items[item.index].children.length > 0) {
      setExpandedItems([...expandedItems, item.index]);
    }

    // Load children
    try {
      const children = await api.categories.list({ parent: item.index });

      // If no children make non-expandable
      if (children.count === 0) {
        setItems({
          ...items,
          [item.index]: {
            ...items[item.index],
            hasChildren: false,
          },
        });

        return;
      }

      // Update items state dynamically
      setItems(
        children.results.reduce(
          // Add children to the items list
          (previous, child) => ({
            ...previous,
            [child.id]: {
              index: child.id,
              data: child.name,
              // Child nodes
              hasChildren: true,
              children: [],
              // Properties
              canMove: false,
              canRename: false,
            },
          }),
          // Add children to the parent list
          {
            ...items,
            [item.index]: {
              ...items[item.index],
              children: children.results.map((child) => child.id),
            },
          }
        )
      );

      // Expanded target item
      setExpandedItems([...expandedItems, item.index]);
    } catch (error) {
      throw error;
    }
  };

  const handleCollapseItem = (item) => {
    setExpandedItems(
      // Remove collapse item from expanded
      expandedItems.filter(
        (expandedItemIndex) => expandedItemIndex !== item.index
      )
    );
  };

  const handleSelectItems = (items) => setSelectedItems(items);

  const render = () => {
    if (items === null) {
      return <Spinner animation="border" variant="light" size="sm" />;
    }

    // console.log(items);

    return (
      <Dropdown className="categories">
        <Dropdown.Toggle className="categories-dropdown-toggle">
          <FontAwesomeIcon icon={faCaretDown} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="categories-menu mt-2">
          <Dropdown.Header>Categories</Dropdown.Header>
          <ControlledTreeEnvironment
            items={items}
            getItemTitle={(item) => item.data}
            // Tree view state
            viewState={{
              ["categories-tree"]: {
                focusedItem,
                expandedItems,
                selectedItems,
              },
            }}
            // Handle tree events
            onFocusItem={handleFocusItem}
            onExpandItem={handleExpandItem}
            onCollapseItem={handleCollapseItem}
            onSelectItems={handleSelectItems}
            // Settings
            canDragAndDrop={false}
            canDropOnItemWithChildren={false}
            canReorderItems={false}
            canSearch={false}
            canSearchByStartingTyping={false}
            canRename={false}
          >
            <Tree
              treeId="categories-tree"
              rootItem="root"
              treeLabel="Categories Tree"
            />
          </ControlledTreeEnvironment>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return render();
};

export default Categories;
