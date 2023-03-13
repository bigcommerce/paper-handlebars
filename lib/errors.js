const AppError = require('./appError');

class CompileError extends AppError {};          // Error compiling template
class FormatError extends AppError {};           // Error restoring precompiled template
class RenderError extends AppError {};           // Error rendering template
class DecoratorError extends AppError {};        // Error applying decorator
class TemplateNotFoundError extends AppError {}; // Template not registered
class ValidationError extends Error {};

module.exports = {
    CompileError,
    FormatError,
    RenderError,
    DecoratorError,
    TemplateNotFoundError,
    ValidationError 
};
