// src/components/common/Card.jsx
const Card = ({ 
    children, 
    title, 
    className = '',
    headerClassName = '',
    bodyClassName = ''
  }) => {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {title && (
          <div className={`p-4 border-b ${headerClassName}`}>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        <div className={`p-4 ${bodyClassName}`}>
          {children}
        </div>
      </div>
    );
  };
  
  export default Card;